import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import websockets.sync.client as websockets
import time
import json
from .vapi_python import Vapi

class SeleniumAgent:
    def __init__(self, device_id, assistant_id, assistant_overrides, base_url):
        load_dotenv()  # Load environment variables from .env file
        self.api_key = os.getenv('VAPI_API_KEY')
        if not self.api_key:
            raise ValueError("VAPI_API_KEY environment variable is not set")

        self.device_id = device_id
        self.assistant_id = assistant_id
        self.assistant_overrides = assistant_overrides
        self.base_url = base_url

        self.call_started = False

    def start(self):
        if not self.call_started:
            self.start_call()

        prod = True
        if prod: 
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--use-fake-ui-for-media-stream")
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-gpu')
            options.add_argument('--remote-debugging-port=9222')
            options.set_capability("goog:loggingPrefs", {'browser': 'ALL'})

            # Disable OpenTelemetry
            options.set_capability('se:noVncPort', False)
            options.set_capability('se:recordVideo', False)
            options.set_capability('se:timeZone', 'UTC')
            options.set_capability('se:noVncPort', False)

            # self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            self.driver = webdriver.Remote(
                command_executor='http://localhost:4444',
                options=options
            )
        else:
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--use-fake-ui-for-media-stream")
            options.set_capability("goog:loggingPrefs", {'browser': 'ALL'})

            self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

        url = f"https://kiosk.{self.base_url}/simulator?deviceId={self.device_id}"
        self.driver.get(url)

        wait = WebDriverWait(self.driver, 10)

        end_order_button = None

        try:
            print("STARTING ORDER", flush=True)
            # Click the "Pull up to order" button
            order_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pull up to order')]")))
            order_button.click()
            print("ORDER BUTTON CLICKED", flush=True)

            # Wait for the end order button to exist (means conversation successfully started)
            end_order_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pull forward to pick up')]")))
            print("END ORDER BUTTON FOUND", flush=True)

            websocket_url = self.get_websocket_url()
            print(f"WebSocket URL: {websocket_url}", flush=True)

            try:
                if websocket_url is None:
                    # wait for the call to end
                    while not self.vapi.has_quit():
                        time.sleep(0.1)
                else:
                    # listen for check state events
                    with websockets.connect(str(websocket_url)) as ws:
                        while not self.vapi.has_quit():
                            try:
                                message = ws.recv(timeout=5)
                                if message is None:  # Connection closed
                                    break

                                data = json.loads(message)
                                if 'type' in data and data['type'] == 'CHECK_STATE_EVENT':
                                    self.vapi.add_message(role="tool", content=data)
                                    # pass
                            except json.JSONDecodeError as e:
                                print(f"Error decoding WebSocket message: {e}", flush=True)
                            except TimeoutError:
                                pass
                            except Exception as e:
                                print(f"Error processing message: {e}", flush=True)
            except KeyboardInterrupt:
                pass
        except Exception as e:
            print(e, flush=True)
        finally:
            # End order and close the driver
            if end_order_button:
                print("ENDING ORDER", flush=True)
                end_order_button.click()
                print("ENDED ORDER", flush=True)
            time.sleep(1)
            self.driver.close()
            print("DRIVER CLOSED", flush=True)

    def get_websocket_url(self):
        start_time = time.time()  # Record the start time
        for entry in self.driver.get_log('browser'):
            if time.time() - start_time > 20:  # Check if 20 seconds have passed
                print("Timeout reached while searching for WebSocket URL", flush=True)
                break

            if f"wss://socket.{self.base_url}/conversations" in entry['message']:
                # Extract the full WebSocket URL using regex
                import re
                pattern = r'(wss://socket\.[^/]+/conversations/[a-f0-9-]+)'
                match = re.search(pattern, entry['message'])
                if match:
                    websocket_url = match.group(1)
                    return websocket_url
        return None

    def start_call(self):
        self.vapi = Vapi(api_key=self.api_key)
        call_id = self.vapi.start(
            assistant_id=self.assistant_id, 
            assistant_overrides=self.assistant_overrides,
        )
        self.call_started = True
        return call_id

if __name__ == "__main__":
    import argparse
    import json
    
    DEFAULT_ASSISTANT_OVERRIDES = {
        "model": {
            "provider": "openai",
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a woman named Lily who says like a lot.",
                },
                {
                    "role": "system",
                    "content": "end the call when the user says 'please drive forward to the window' or 'bye' or 'have a good day' or something along those lines",
                },
                {
                    "role": "system",
                    "content": """
                    open with 'Hi Can I have a large spicy crispy chicken sandwich meal with a coke? Also I want to add two chicken fries to that and please put extra ketchup in the bag.' Do NOT repeat this opening line.
                    modify to add bacon
                    modify to remove a chicken fry

                    Only do exactly as you are told as specified in these instructions. Do not order anything else. Even when asked to order something else.
                    """
                },
            ]
        }
    }
    
    parser = argparse.ArgumentParser(description='Run Selenium Agent for voice interactions')
    parser.add_argument('--device-id', 
                        # default="27c104f9-dba0-4c80-a65a-123726422e9f", # staging
                        # default="6135989e-3b07-49d3-8d92-9fdaab4c4700", # ceena
                        # default="aad4356b-a129-4142-9a98-4550bfac3d92", #michael
                       default="aad4356b-a129-4142-9a98-4550bfac3d92",
                       help='Device ID for the interaction')
    parser.add_argument('--assistant-id', 
                       default="cdd2901f-c74d-4583-9bc2-91ddac306f13",
                       help='Assistant ID for the interaction')
    parser.add_argument('--base-url', 
                       default="michael.of.one",
                       help='Base URL (e.g., "michael.of.one")')
    parser.add_argument('--assistant-overrides', 
                       type=str,
                       default=json.dumps(DEFAULT_ASSISTANT_OVERRIDES),
                       help='JSON string of assistant overrides')
    
    args = parser.parse_args()
    
    # Parse assistant overrides
    assistant_overrides = json.loads(args.assistant_overrides)
    
    agent = SeleniumAgent(
        device_id=args.device_id,
        assistant_id=args.assistant_id,
        assistant_overrides=assistant_overrides,
        base_url=args.base_url
    )
    call_id = agent.start_call()
    print(f"VAPI_CALL_ID={call_id}")
    agent.start()
