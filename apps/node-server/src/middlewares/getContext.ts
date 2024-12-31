import { Socket } from "socket.io";
import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { getScenariosWithGeneralEvals } from "../services/scenario";
import { connectedUsers } from "../index";
import {
  CallWithIncludesAndTestSchema,
  CallWithIncludesSchema,
} from "@repo/types/src";

export const getContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const callId = req.body.message?.call?.id;
    if (!callId) {
      throw new Error("No call ID provided");
    }

    const _call = await db.call.findFirst({
      where: { vapiCallId: callId },
      include: {
        testAgent: true,
        scenario: {
          include: {
            evaluations: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        test: {
          include: {
            agent: {
              include: {
                enabledGeneralEvaluations: {
                  include: { evaluationTemplate: true },
                },
              },
            },
          },
        },
      },
    });

    if (!_call) {
      throw new Error(`No call found in DB for call ID ${callId}`);
    }

    const call = CallWithIncludesAndTestSchema.safeParse(_call);

    if (!call.success) {
      throw new Error(
        `failed to parse call with call ID ${callId}: ${call.error.message}`,
      );
    }

    const { test, scenario } = call.data;
    const agent = test?.agent;
    const ownerId = agent?.ownerId;

    if (!ownerId) {
      throw new Error(`No owner ID found for agentId ${agent?.id}`);
    }
    if (!scenario) {
      throw new Error(`No scenario found for call ${callId}`);
    }
    if (!test) {
      throw new Error(`No test found for call ${callId}`);
    }

    const scenarioWithGeneralEvals = await getScenariosWithGeneralEvals(
      agent,
      scenario,
    );

    const userSocket = connectedUsers.get(ownerId);

    res.locals.context = {
      userSocket,
      agent,
      scenario: scenarioWithGeneralEvals,
      call,
      test,
    };

    next();
  } catch (error) {
    console.error("Error getting context", error);
    next(error);
  }
};
