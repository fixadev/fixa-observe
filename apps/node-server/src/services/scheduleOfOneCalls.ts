// Create a Map to store device usage states
const deviceUsageMap = new Map<string, boolean>();

// Queue to store pending calls
interface QueuedCall {
  device_id: string;
  assistant_id: string;
  assistant_overrides: Record<string, any>;
}
const callQueue: QueuedCall[] = [];

export function scheduleOfOneCalls(
  device_ids: string[],
  callsToStart: {
    assistant_id: string;
    assistant_overrides: Record<string, any>;
  }[],
) {
  // Initialize devices as available
  device_ids.forEach((id) => {
    if (!deviceUsageMap.has(id)) {
      deviceUsageMap.set(id, false);
    }
  });

  // Try to start calls or queue them
  for (const call of callsToStart) {
    const availableDevice = device_ids.find((id) => !isDeviceInUse(id));

    if (availableDevice) {
      // Start the call immediately if a device is available
      startCall(availableDevice, call.assistant_id, call.assistant_overrides);
    } else {
      // Queue the call if no device is available
      callQueue.push({
        device_id: device_ids[0], // You might want a better selection strategy
        ...call,
      });
    }
  }
}

function startCall(
  device_id: string,
  assistant_id: string,
  assistant_overrides: Record<string, any>,
) {}

// Helper functions to manage device usage
export function setDeviceInUse(deviceId: string): void {
  deviceUsageMap.set(deviceId, true);
}

export function setDeviceAvailable(deviceId: string): void {
  deviceUsageMap.set(deviceId, false);

  // Try to process queued calls when a device becomes available
  if (callQueue.length > 0) {
    const nextCall = callQueue.shift()!;
    startCall(deviceId, nextCall.assistant_id, nextCall.assistant_overrides);
  }
}

export function isDeviceInUse(deviceId: string): boolean {
  return deviceUsageMap.get(deviceId) ?? false;
}
