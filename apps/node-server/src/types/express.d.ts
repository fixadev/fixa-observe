import { Express } from "express";
import { Socket } from "socket.io";
import {
  Agent,
  AgentWithIncludes,
  Call,
  CallInProgress,
  CallWithIncludes,
  GeneralEvaluation,
  Scenario,
  ScenarioWithIncludes,
  Test,
} from "@repo/types/src/index";

declare global {
  namespace Express {
    interface Locals {
      orgId: string;
      userId?: string;
      context: {
        userSocket: Socket | undefined;
        agent: Agent;
        scenario: ScenarioWithIncludes;
        call: CallInProgress;
        test: Test;
      };
    }
  }
}

// Need this to make it a module
export {};
