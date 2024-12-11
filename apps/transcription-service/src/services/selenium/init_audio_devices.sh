# Load pulseaudio virtual audio source
pulseaudio -k || true
pulseaudio -D --exit-idle-time=-1

# Create virtual output device (used for audio playback)
pactl load-module module-null-sink sink_name=DummyOutput sink_properties=device.description="Virtual_Dummy_Output"

# Create virtual microphone output, used to play media into the "microphone"
pactl load-module module-null-sink sink_name=MicOutput sink_properties=device.description="Virtual_Microphone_Output"

# Set the default source device (for future sources) to use the monitor of the virtual microphone output
# pacmd set-default-source MicOutput.monitor

# Create a virtual audio source linked up to the virtual microphone output
# pacmd load-module module-virtual-source source_name=VirtualMic
pacmd load-module module-remap-source source_name=VirtualMic master=MicOutput.monitor

# Allow pulse audio to be accssed via TCP (from localhost only), to allow other users to access the virtual devices
pacmd load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1

# List all audio sources and sinks for verification
echo "=== Audio Sources ==="
pacmd list-sources | grep -e 'name:' -e 'device.description ='

echo "=== Audio Sinks ==="
pacmd list-sinks | grep -e 'name:' -e 'device.description ='

# Configure the "seluser" user to use the network virtual soundcard
mkdir -p /home/seluser/.pulse
echo "default-server = 127.0.0.1" > /home/seluser/.pulse/client.conf
chown seluser:seluser /home/seluser/.pulse -R

# Configure the "root" user to use the network virtual soundcard
# mkdir -p /home/root/.pulse
# echo "default-server = 127.0.0.1" > /home/root/.pulse/client.conf
# chown root:root /home/root/.pulse -R

# Start Selenium-Chrome-Standalone
screen -d -m /opt/bin/entry_point.sh 
# /opt/bin/entry_point.sh 
sleep 2

echo "Selenium-Chrome-Standalone started"