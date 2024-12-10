from daily import *
import requests
from .daily_call import DailyCall
import json

SAMPLE_RATE = 16000
CHANNELS = 1


def create_web_call(api_url, api_key, payload):
    url = f"{api_url}/call/web"
    headers = {
        'Authorization': 'Bearer ' + api_key,
        'Content-Type': 'application/json'
    }
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    if response.status_code == 201:
        call_id = data.get('id')
        web_call_url = data.get('webCallUrl')
        control_url = data.get('monitor').get('controlUrl')
        return call_id, web_call_url, control_url
    else:
        raise Exception(f"Error: {data['message']}")

def send_message(control_url, message):
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(control_url, headers=headers, json=message)
    return response.json()

class Vapi:
    def __init__(self, *, api_key, api_url="https://api.vapi.ai"):
        self.api_key = api_key
        self.api_url = api_url

    def start(
        self,
        *,
        assistant_id=None,
        assistant=None,
        assistant_overrides=None,
        squad_id=None,
        squad=None,
    ):
        # Start a new call
        if assistant_id:
            payload = {'assistantId': assistant_id, 'assistantOverrides': assistant_overrides}
        elif assistant:
            payload = {'assistant': assistant, 'assistantOverrides': assistant_overrides}
        elif squad_id:
            payload = {'squadId': squad_id}
        elif squad:
            payload = {'squad': squad}
        else:
            raise Exception("Error: No assistant specified.")

        call_id, web_call_url, control_url = create_web_call(
            self.api_url, self.api_key, payload)
        self.control_url = control_url

        if not web_call_url:
            raise Exception("Error: Unable to create call.")

        print('Joining call... ' + call_id)

        self.client = DailyCall()
        self.client.join(web_call_url)

        return call_id

    def has_quit(self):
        if not self.client:
            return True
        return self.client.has_quit()

    def stop(self):
        if self.client:
            self.client.leave()
            self.client = None

    def send(self, message):
        """
        Send a generic message to the assistant.

        :param message: A dictionary containing the message type and content.
        """
        if not self.client:
            raise Exception("Call not started. Please start the call first.")

        # Check message format here instead of serialization
        if not isinstance(message, dict) or 'type' not in message:
            raise ValueError("Invalid message format.")

        try:
            self.client.send_app_message(message)  # Send dictionary directly
        except Exception as e:
            print(f"Failed to send message: {e}")

    def add_message(self, role, content):
        """
        method to send text messages with specific parameters.
        """
        message = {
            'type': 'add-message',
            'message': {
                'role': role,
                'content': json.dumps(content)
            },
            'triggerResponseEnabled': False,
        }
        # print("ADD MESSAGE: ", message)
        response = send_message(self.control_url, message)
        # print("ADD MESSAGE Response: ", response)