import axios from "axios";
import { env } from "../env";
import { db } from "../db";
import { CallStatus } from "@prisma/client";

// Create a Map to store device usage states
const deviceUsageMap = new Map<string, boolean>();

// Queue to store pending calls

interface QueuedCall {
  deviceId: string;
  testId: string;
  testAgentId: string;
  scenarioId: string;
  ownerId: string;
  assistantId: string;
  testAgentPrompt: string;
  scenarioPrompt: string;
}

export interface CallToStart {
  testId: string;
  assistantId: string;
  testAgentPrompt: string;
  scenarioPrompt: string;
  testAgentId: string;
  scenarioId: string;
  ownerId: string;
}

const callQueue: QueuedCall[] = [];

export function scheduleOfOneCalls(
  deviceIds: string[],
  callsToStart: CallToStart[],
) {
  // Initialize devices as available
  deviceIds.forEach((id) => {
    if (!deviceUsageMap.has(id)) {
      deviceUsageMap.set(id, false);
    }
  });

  // Try to start calls or queue them
  for (const call of callsToStart) {
    const availableDevice = deviceIds.find((id) => !isDeviceInUse(id));

    if (availableDevice) {
      // Start the call immediately if a device is available
      startCall({
        deviceId: availableDevice,
        assistantId: call.assistantId,
        testAgentPrompt: call.testAgentPrompt,
        scenarioPrompt: call.scenarioPrompt,
        testId: call.testId,
        testAgentId: call.testAgentId,
        scenarioId: call.scenarioId,
        ownerId: call.ownerId,
      });
    } else {
      // Queue the call if no device is available
      callQueue.push({
        deviceId: deviceIds[0], // You might want a better selection strategy
        ...call,
      });
    }
  }
}

// Helper functions to manage device usage
export function setDeviceInUse(deviceId: string): void {
  deviceUsageMap.set(deviceId, true);
}

export function setDeviceAvailable(deviceId: string): void {
  deviceUsageMap.set(deviceId, false);

  // Try to process queued calls when a device becomes available
  if (callQueue.length > 0) {
    const nextCall = callQueue.shift()!;
    startCall(nextCall);
  }
}

export function isDeviceInUse(deviceId: string): boolean {
  return deviceUsageMap.get(deviceId) ?? false;
}

export const startCall = async ({
  deviceId,
  assistantId,
  testAgentPrompt,
  scenarioPrompt,
  testId,
  testAgentId,
  scenarioId,
  ownerId,
}: QueuedCall) => {
  const { data } = await axios.post<{ callId: string }>(
    `${env.AUDIO_SERVICE_URL}/websocket-call-ofone`,
    {
      device_id: deviceId,
      assistant_id: assistantId,
      assistant_overrides: {
        serverUrl: env.VAPI_SERVER_URL,
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
    },
  );
  await db.call.create({
    data: {
      id: data.callId,
      status: CallStatus.in_progress,
      stereoRecordingUrl: "",
      testId: testId,
      testAgentId: testAgentId,
      scenarioId: scenarioId,
      ownerId: ownerId,
    },
  });
};
