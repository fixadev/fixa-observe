import axios from "axios";
import { db } from "../../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Message, Role } from "@prisma/client";
import { env } from "../../env";
import { calculateLatencyPercentiles } from "../../utils/time";
import { uploadFromPresignedUrl } from "../aws";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "../../clients/openAIClient";
import { z } from "zod";
import { analyzeCallWitho1 } from "../textAnalysis";
import { sendAlerts } from "../alert";
import stripeServiceClient from "../../clients/stripeServiceClient";
import { SearchService } from "@repo/services/src/search";
import {
  instantiateEvaluationTemplate,
  instantiateEvaluation,
} from "@repo/utils/src/instantiate";
import { getAudioDuration } from "../../utils/audio";
import {
  SavedSearchWithIncludes,
  UploadCallParams,
  EvaluationGroupWithIncludes,
  EvaluationResult,
  EvaluationGroupResult,
  TemporaryScenario,
} from "@repo/types/src/index";
import { EvaluationService } from "@repo/services/src/evaluation";

const evaluationService = new EvaluationService(db);

export const analyzeAndSaveCall = async ({
  callId,
  stereoRecordingUrl,
  createdAt,
  agentId,
  metadata: callMetadata,
  ownerId,
  saveRecording,
  language,
  scenario,
}: UploadCallParams) => {
  try {
    interface TranscribeResponse {
      segments: Array<{
        start: number;
        end: number;
        text: string;
        role: "user" | "agent";
      }> | null;
      interruptions: Array<{
        secondsFromStart: number;
        duration: number;
        text: string;
      }> | null;
      latencyBlocks: Array<{
        secondsFromStart: number;
        duration: number;
      }> | null;
    }

    const duration = await getAudioDuration(stereoRecordingUrl);

    const urlToSave =
      saveRecording === false
        ? stereoRecordingUrl
        : await uploadFromPresignedUrl(
            callId,
            stereoRecordingUrl,
            scenario ? true : false,
          );

    const response = await axios.post<TranscribeResponse>(
      `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
      {
        stereo_audio_url: urlToSave,
        language,
      },
      {
        headers: {
          Authorization: `Bearer ${env.PYTHON_SERVER_SECRET}`,
        },
      },
    );

    const { segments, interruptions, latencyBlocks } = response.data;

    const latencyDurations = latencyBlocks?.map((block) => block.duration);

    const {
      p50: latencyP50,
      p90: latencyP90,
      p95: latencyP95,
    } = calculateLatencyPercentiles(latencyDurations || []);

    const {
      p50: interruptionP50,
      p90: interruptionP90,
      p95: interruptionP95,
    } = calculateLatencyPercentiles(
      interruptions?.map((interruption) => interruption.duration) || [],
    );

    const numberOfInterruptionsGreaterThan2Seconds = interruptions?.filter(
      (interruption) => interruption.duration > 2,
    ).length;

    const messages = segments?.map((segment) => ({
      id: uuidv4(),
      role: segment.role === "user" ? Role.user : Role.bot,
      message: segment.text,
      secondsFromStart: segment.start,
      duration: segment.end - segment.start,
      name: "",
      result: "",
      time: segment.start,
      endTime: segment.end,
      toolCalls: null,
    }));

    let evalResults;
    let evalSetResults: EvaluationGroupResult[];
    let savedSearches: SavedSearchWithIncludes[];

    if (scenario) {
      ({ evalResults, evalSetResults, savedSearches } =
        await analyzeBasedOnScenario({
          messages: messages || [],
          createdAt: createdAt || new Date().toISOString(),
          agentId,
          callMetadata: callMetadata || {},
          ownerId,
          scenario,
        }));
    } else {
      ({ evalResults, evalSetResults, savedSearches } =
        await analyzeBasedOnRules({
          messages: messages || [],
          createdAt: createdAt || new Date().toISOString(),
          agentId,
          callMetadata: callMetadata || {},
          ownerId,
        }));
    }

    const newCall = await db.call.create({
      data: {
        id: uuidv4(),
        isRead: false,
        createdAt: createdAt || new Date(),
        ownerId,
        customerCallId: callId,
        startedAt: createdAt,
        status: CallStatus.completed,
        stereoRecordingUrl: urlToSave,
        agentId,
        evaluationResults: {
          create: evalResults?.map((result) => ({
            ...result,
            evaluationId: undefined,
            evaluation: {
              connect: {
                id: result.evaluationId,
              },
            },
          })),
        },
        evalSetToSuccess: Object.fromEntries(
          evalSetResults.map((result) => [result.id, result.result]),
        ),
        timeToFirstWord: Math.round((latencyBlocks?.[0]?.duration ?? 0) * 1000),
        latencyP50,
        latencyP90,
        latencyP95,
        interruptionP50,
        interruptionP90,
        interruptionP95,
        numInterruptions: numberOfInterruptionsGreaterThan2Seconds,
        metadata: callMetadata,
        duration,
        messages: {
          create: messages?.map((message) => ({
            ...message,
            toolCalls: undefined,
          })),
        },
        latencyBlocks: {
          create: latencyBlocks?.map((block) => ({
            secondsFromStart: block.secondsFromStart,
            duration: block.duration,
          })),
        },
        interruptions: {
          create: interruptions?.map((interruption) => ({
            secondsFromStart: interruption.secondsFromStart,
            duration: interruption.duration,
            text: interruption.text,
          })),
        },
      },
      include: {
        agent: true,
      },
    });

    // Accrue observability minutes after call is created in db
    try {
      const durationMinutes = Math.ceil(duration / 60);
      await stripeServiceClient.accrueObservabilityMinutes({
        orgId: ownerId,
        minutes: durationMinutes,
      });
    } catch (error) {
      console.error("Error accruing observability minutes", error);
    }

    if (!scenario) {
      await sendAlerts({
        ownerId,
        latencyDurations,
        savedSearches,
        evalSetResults,
        call: newCall,
      });
    }

    return newCall;
  } catch (error) {
    console.error("Error in analyzeAndSaveCall:", error);
    throw error;
  }
};

export const analyzeBasedOnScenario = async ({
  messages,
  createdAt,
  agentId,
  callMetadata,
  ownerId,
  scenario,
}: {
  messages: Omit<Message, "callId">[];
  createdAt: string;
  agentId: string;
  callMetadata: Record<string, string>;
  ownerId: string;
  scenario: TemporaryScenario;
}) => {
  try {
    const existingEvaluations = await evaluationService.getByOwnerId(ownerId);
    const existingRelevantEvaluations = existingEvaluations.filter(
      (evaluation) =>
        scenario.evaluations.some(
          (tempEval) =>
            tempEval.prompt === evaluation.evaluationTemplate.description,
        ),
    );

    const templatesToCreate = scenario.evaluations
      .filter(
        (tempEval) =>
          !existingRelevantEvaluations.some(
            (existingEval) =>
              existingEval.evaluationTemplate.description === tempEval.prompt,
          ),
      )
      .map((tempEval) => ({
        ...instantiateEvaluationTemplate({
          name: tempEval.name,
          description: tempEval.prompt,
        }),
      }));

    const newEvaluationTemplates = await evaluationService.createTemplates({
      templates: templatesToCreate,
      ownerId,
    });

    const newEvaluations = await evaluationService.createMany({
      evaluations: newEvaluationTemplates.map((template) => ({
        ...instantiateEvaluation({
          evaluationTemplateId: template.id,
          evaluationTemplate: undefined,
        }),
      })),
    });

    const allEvaluations = [...newEvaluations, ...existingRelevantEvaluations];

    console.log("allEvaluations", allEvaluations);

    const result = await analyzeCallWitho1({
      callStartedAt: createdAt,
      messages: messages || [],
      testAgentPrompt: "",
      scenario: undefined,
      evals: allEvaluations,
    });

    console.log("evalResults", result);

    const validEvalResults = result.filter((result) =>
      allEvaluations.some(
        (evaluation) => evaluation.id === result.evaluationId,
      ),
    );

    console.log("validEvalResults", validEvalResults);

    return {
      evalResults: validEvalResults,
      evalSetResults: [],
      savedSearches: [],
    };
  } catch (error) {
    console.error("Error in analyzeBasedOnScenario:", error);
    return {
      evalResults: [],
      evalSetResults: [],
      savedSearches: [],
    };
  }
};

export const analyzeBasedOnRules = async ({
  messages,
  createdAt,
  agentId,
  callMetadata,
  ownerId,
}: {
  messages: Omit<Message, "callId">[];
  createdAt: string;
  agentId: string;
  callMetadata: Record<string, string>;
  ownerId: string;
}) => {
  try {
    const { relevantEvalSets, savedSearches } = await findRelevantEvalSets({
      messages,
      ownerId,
      agentId,
      callMetadata,
    });
    if (relevantEvalSets.length > 0) {
      const allEvals = relevantEvalSets.flatMap(
        (evalSet) => evalSet.evaluations,
      );
      const result = await analyzeCallWitho1({
        callStartedAt: createdAt,
        messages: messages || [],
        testAgentPrompt: "",
        scenario: undefined,
        evals: allEvals,
      });

      const validEvalResults = result.filter((result) =>
        allEvals.some((evaluation) => evaluation.id === result.evaluationId),
      );

      const evalSetResults = relevantEvalSets.map((evalSet) => ({
        id: evalSet.id,
        result: validEvalResults
          .filter((result) =>
            evalSet.evaluations.some(
              (evaluation) => evaluation.id === result.evaluationId,
            ),
          )
          .every(
            (result) =>
              result.success ||
              !allEvals.find(
                (evaluation) => evaluation.id === result.evaluationId,
              )?.isCritical,
          ),
      }));

      return {
        evalResults: validEvalResults,
        evalSetResults,
        savedSearches,
      };
    } else {
      return {
        evalSets: [],
        evalSetResults: [],
        savedSearches,
      };
    }
  } catch (error) {
    console.error("Error in analyzeBasedOnRules:", error);
    return {
      evalSets: [],
      evalSetResults: [],
      savedSearches: [],
    };
  }
};

export const findRelevantEvalSets = async ({
  messages,
  ownerId,
  agentId,
  callMetadata,
}: {
  messages: Omit<Message, "callId">[];
  ownerId: string;
  agentId: string;
  callMetadata?: Record<string, string>;
}): Promise<{
  savedSearches: SavedSearchWithIncludes[];
  relevantEvalSets: EvaluationGroupWithIncludes[];
}> => {
  try {
    const searchServiceInstance = new SearchService(db);
    const savedSearches = await searchServiceInstance.getAll({
      ownerId,
    });
    if (!savedSearches) {
      return {
        savedSearches: [],
        relevantEvalSets: [],
      };
    }
    const matchingSavedSearches = savedSearches.filter((savedSearch) => {
      const savedSearchMetadata = savedSearch.metadata as Record<
        string,
        string | string[]
      > | null;
      return (
        Object.entries(savedSearchMetadata || {}).every(
          ([key, value]) =>
            callMetadata?.[key] === value ||
            (callMetadata?.[key] && value?.includes(callMetadata?.[key])),
        ) &&
        (savedSearch.agentId.includes(agentId) ||
          savedSearch.agentId.length === 0)
      );
    });

    const evalSetsWithEvals = matchingSavedSearches
      .flatMap((savedSearch) => savedSearch.evaluationGroups)
      .filter((evaluationGroup) => evaluationGroup !== undefined)
      .filter((evalGroup) => evalGroup.enabled);

    // remove evals and alerts to simplify prompt
    const evalSetsWithoutEvals = evalSetsWithEvals.map((evalSet) => ({
      ...evalSet,
      evals: [],
      alerts: [],
    }));

    const findEvalSetsOutputSchema = z.object({
      relevantEvalSets: z.array(
        z.object({
          id: z.string(),
          relevant: z.boolean(),
        }),
      ),
    });

    const prompt = `
    Your job is to determine which eval sets are relevant to the following call by comparing the call transcript to the eval set condition:

    Determine IF the condition in the eval set is clearly true for the call transcript. And return an array of objects with the following fields:
    - id: the id of the eval set
    - relevant: true if the condition is clearly true for the call transcript, false otherwise

    For example, for this eval set:

    {
      "id": "1234",
      "condition": "the user tries to book an appointment"
    }

    and this call transcript:

    [
      {
        "role": "user",
        "message": "hi"
      },
      {
        "role": "bot",
        "message": "hello"
      },
      {
        "role": "user",
        "message": "what are the hours of your store?"
      }
    ]

    The eval set is not relevant because the condition "the user tries to book an appointment" is not clearly true for the call transcript.

    So the output should be:

    [
      {
        "id": "1234",
        "relevant": false
      }
    ]

    Here is the call transcript:
    ${JSON.stringify(messages, null, 2)}

    Here are the eval sets:
    ${JSON.stringify(evalSetsWithoutEvals, null, 2)}

    Return a array of objects with the following fields:
    - id: the id of the eval set
    - relevant: true if the condition is clearly true for the call transcript, false otherwise

    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      max_tokens: 10000,
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(
        findEvalSetsOutputSchema,
        "evalResults",
      ),
    });

    const parsedResponse = completion.choices[0]?.message.parsed;

    if (!parsedResponse) {
      throw new Error("No response from OpenAI");
    }

    return {
      savedSearches: matchingSavedSearches,
      relevantEvalSets: evalSetsWithEvals.filter((evalSet) => {
        return parsedResponse.relevantEvalSets.some(
          (relevantEvalSet) =>
            relevantEvalSet.id === evalSet.id &&
            relevantEvalSet.relevant &&
            evalSet.evaluations.length > 0,
        );
      }),
    };
  } catch (error) {
    console.error("Error in findRelevantEvalGroups:", error);
    throw error;
  }
};
