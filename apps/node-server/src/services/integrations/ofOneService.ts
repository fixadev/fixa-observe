import axios from "axios";
import { env } from "../../env";
import { db } from "../../db";
import { CallResult, CallStatus } from "@prisma/client";
import { Socket } from "socket.io";

// Create a Map to store device usage states
const deviceUsageMap = new Map<string, boolean>();

// Queue to store pending calls

interface QueuedCall {
  callId: string;
  ownerId: string;
  deviceId: string;
  assistantId: string;
  testAgentPrompt?: string;
  scenarioPrompt?: string;
  baseUrl: string;
}

const callQueue: QueuedCall[] = [];

export async function scheduleOfOneCalls(
  deviceIds: string[],
  callsToStart: QueuedCall[],
  connectedUsers: Map<string, Socket>,
) {
  try {
    // Initialize devices as available
    deviceIds.forEach((id) => {
      if (!deviceUsageMap.has(id)) {
        deviceUsageMap.set(id, false);
      }
    });

    // Try to start calls or queue them
    for (const callDetails of callsToStart) {
      const availableDevice = deviceIds.find((id) => !isDeviceInUse(id));

      if (availableDevice) {
        // Start the call immediately if a device is available
        await startCall(
          {
            callId: callDetails.callId,
            ownerId: callDetails.ownerId,
            deviceId: availableDevice,
            assistantId: callDetails.assistantId,
            testAgentPrompt: callDetails.testAgentPrompt,
            scenarioPrompt: callDetails.scenarioPrompt,
            baseUrl: callDetails.baseUrl,
          },
          connectedUsers.get(callDetails.ownerId),
        );
      } else {
        // Queue the call if no device is available
        callQueue.push({
          deviceId: "",
          callId: callDetails.callId,
          ownerId: callDetails.ownerId,
          assistantId: callDetails.assistantId,
          testAgentPrompt: callDetails.testAgentPrompt,
          scenarioPrompt: callDetails.scenarioPrompt,
          baseUrl: callDetails.baseUrl,
        });
      }
    }
    return callsToStart.map((call) => ({
      id: call.callId,
    }));
  } catch (error) {
    console.error("Error scheduling OFONE calls", error);
  }
}

// Helper functions to manage device usage
export function setDeviceInUse(deviceId: string): void {
  deviceUsageMap.set(deviceId, true);
}

export function setDeviceAvailable(
  deviceId: string,
  userSocket?: Socket,
): void {
  deviceUsageMap.set(deviceId, false);

  console.log(
    "========================Setting device available=========================",
    deviceId,
  );
  console.log("deviceUsageMap", deviceUsageMap);
  console.log("callQueue", callQueue);

  // Try to process queued calls when a device becomes available
  if (callQueue.length > 0) {
    const nextCall = callQueue.shift()!;
    startCall({ ...nextCall, deviceId }, userSocket);
  }
}

export function isDeviceInUse(deviceId: string): boolean {
  return deviceUsageMap.get(deviceId) ?? false;
}

export async function startCall(
  {
    callId,
    deviceId,
    assistantId,
    testAgentPrompt,
    scenarioPrompt,
    baseUrl,
  }: QueuedCall,
  userSocket?: Socket,
) {
  userSocket?.emit("call-started", { callId });
  try {
    setDeviceInUse(deviceId);
    console.log(
      "========================Starting OFONE call=========================",
      callId,
      deviceId,
      assistantId,
    );
    console.log("deviceUsageMap", deviceUsageMap);
    console.log("callQueue", callQueue);
    const { data } = await axios.post<{ callId: string }>(
      `https://api.pixa.dev/run-ofone-kiosk`,
      {
        device_id: deviceId,
        assistant_id: assistantId,
        assistant_overrides: {
          // for now
          serverUrl: env.NODE_SERVER_URL + "/vapi",
          model: {
            provider: "openai",
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: testAgentPrompt,
              },
              {
                role: "system",
                content:
                  "end the call when the user says 'please drive forward to the window' or 'bye' or 'have a good day' or something along those lines",
              },
              {
                role: "system",
                content: scenarioPrompt,
              },
            ],
          },
        },
        base_url: baseUrl,
      },
    );
    console.log("data from OFONE call", data);
    await db.call.update({
      where: {
        id: callId,
      },
      data: {
        status: CallStatus.in_progress,
        vapiCallId: data.callId,
        ofOneDeviceId: deviceId,
      },
    });
  } catch (error) {
    setDeviceAvailable(deviceId, userSocket);
    console.error("Error starting OFONE call", error);
    await db.call.update({
      where: {
        id: callId,
      },
      data: {
        status: CallStatus.completed,
        result: CallResult.success,
      },
    });
  }
}
