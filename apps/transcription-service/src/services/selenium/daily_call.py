import daily
import threading
import json
import queue
import pasimple

SAMPLE_RATE = 16000
NUM_CHANNELS = 1
CHUNK_SIZE = 640

SOURCE_NAME = "DummyOutput.monitor"
SINK_NAME = "MicOutput"


def is_playable_speaker(participant):
    is_speaker = "userName" in participant["info"] and participant["info"]["userName"] == "Vapi Speaker"
    mic = participant["media"]["microphone"]
    is_subscribed = mic["subscribed"] == "subscribed"
    is_playable = mic["state"] == "playable"
    return is_speaker and is_subscribed and is_playable


class DailyCall(daily.EventHandler):
    def __init__(self):
        daily.Daily.init()

        self.__input_audio_stream = pasimple.PaSimple(pasimple.PA_STREAM_RECORD, format=pasimple.PA_SAMPLE_S16LE, channels=NUM_CHANNELS, rate=SAMPLE_RATE, device_name=SOURCE_NAME)
        self.__output_audio_stream = pasimple.PaSimple(pasimple.PA_STREAM_PLAYBACK, format=pasimple.PA_SAMPLE_S16LE, channels=NUM_CHANNELS, rate=SAMPLE_RATE, device_name=SINK_NAME)

        print("Audio streams created!")

        self.__mic_device = daily.Daily.create_microphone_device(
            "my-mic",
            sample_rate=SAMPLE_RATE,
            channels=NUM_CHANNELS
        )

        self.__speaker_device = daily.Daily.create_speaker_device(
            "my-speaker",
            sample_rate=SAMPLE_RATE,
            channels=NUM_CHANNELS
        )
        daily.Daily.select_speaker_device("my-speaker")

        self.__call_client = daily.CallClient(event_handler=self)

        self.__call_client.update_inputs({
            "camera": False,
            "microphone": {
                "isEnabled": True,
                "settings": {
                    "deviceId": "my-mic",
                    "customConstraints": {
                        "autoGainControl": {"exact": True},
                        "noiseSuppression": {"exact": True},
                        "echoCancellation": {"exact": True},
                    }
                }
            }
        })

        self.__call_client.update_subscription_profiles({
            "base": {
                "camera": "unsubscribed",
                "microphone": "subscribed"
            }
        })

        self.__participants = dict(self.__call_client.participants())
        del self.__participants["local"]

        self.__app_quit = False
        self.__app_error = None
        self.__app_joined = False
        self.__app_inputs_updated = False

        self.__start_event = threading.Event()
        self.__receive_bot_audio_thread = threading.Thread(
            target=self.receive_bot_audio)
        self.__send_user_audio_thread = threading.Thread(
            target=self.send_user_audio)

        self.__audio_queue = queue.Queue()
        self.__speaker_queue = queue.Queue()

        self.__receive_bot_audio_thread.start()
        self.__send_user_audio_thread.start()

    def has_quit(self):
        return self.__app_quit

    def on_inputs_updated(self, inputs):
        self.__app_inputs_updated = True
        self.maybe_start()

    def on_joined(self, data, error):
        if error:
            print(f"Unable to join call: {error}")
            self.__app_error = error
        else:
            self.__app_joined = True
            print("Joined call!")
        self.maybe_start()

    def on_participant_joined(self, participant):
        self.__participants[participant["id"]] = participant

    def on_participant_left(self, participant, _):
        del self.__participants[participant["id"]]
        self.leave()

    def on_participant_updated(self, participant):
        self.__participants[participant["id"]] = participant
        if is_playable_speaker(participant):
            self.__call_client.send_app_message("playable")

    def on_call_state_updated(self, state):
        print("Call state updated:", state)
        if state == "left":
            self.leave()

    def join(self, meeting_url):
        self.__call_client.join(meeting_url, completion=self.on_joined)

    def leave(self):
        if self.__app_quit:
            return

        self.__app_quit = True
        self.__receive_bot_audio_thread.join()
        print("JOINED RECEIVE BOT AUDIO THREAD")
        self.__send_user_audio_thread.join()
        print("JOINED SEND USER AUDIO THREAD")

        try:
            self.__call_client.leave()
        except:
            pass

    def maybe_start(self):
        if self.__app_error:
            self.__start_event.set()

        if self.__app_inputs_updated and self.__app_joined:
            self.__start_event.set()

    def add_to_audio_queue(self, audio_data):
        """
        Add audio data to the queue for processing.
        
        :param audio_data: Audio data to be queued
        """
        try:
            self.__audio_queue.put(audio_data)
        except Exception as e:
            print(f"Failed to add audio to queue: {e}")

    def send_user_audio(self):
        self.__start_event.wait()

        if self.__app_error:
            print(f"Unable to receive mic audio!")
            return

        while not self.__app_quit:
            try:
                buffer = self.__input_audio_stream.read(CHUNK_SIZE)
                # buffer = self.__input_audio_stream.read(
                # CHUNK_SIZE, exception_on_overflow=False)
                if len(buffer) > 0:
                    try:
                        self.__mic_device.write_frames(buffer)
                    except Exception as e:
                        print(e)
            except queue.Empty:
                continue  # If queue is empty, continue the loop
            except Exception as e:
                print(f"Error processing input audio stream: {e}")
                # pass

    def read_from_speaker_queue(self):
        """
        Read audio data from the speaker queue.
        
        :param chunk_size: Size of audio chunk to read (default: CHUNK_SIZE)
        :param timeout: How long to wait for data (seconds)
        :return: Audio data or None if queue is empty
        """
        try:
            return self.__speaker_queue.get_nowait()
        except queue.Empty:
            return None
        except Exception as e:
            print(f"Failed to read from speaker queue: {e}")
            return None

    def receive_bot_audio(self):
        self.__start_event.wait()

        if self.__app_error:
            print(f"Unable to receive bot audio!")
            return

        while not self.__app_quit:
            buffer = self.__speaker_device.read_frames(CHUNK_SIZE)

            if len(buffer) > 0:
                try:
                    # self.__output_audio_stream.write(buffer, CHUNK_SIZE)
                    self.__output_audio_stream.write(buffer)
                except Exception as e:
                    print(f"Error writing to output audio stream: {e}")

    def send_app_message(self, message):
        """
        Send an application message to the assistant.

        :param message: The message to send (expects a dictionary).
        """
        try:
            serialized_message = json.dumps(message)
            self.__call_client.send_app_message(serialized_message)
        except Exception as e:
            print(f"Failed to send app message: {e}")