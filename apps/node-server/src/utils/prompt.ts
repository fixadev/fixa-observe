import { Evaluation, Scenario } from "@prisma/client";
import { ArtifactMessagesItem } from "@vapi-ai/server-sdk/api";
import { getDateTimeAtTimezone } from "./time";
import { ScenarioWithIncludes } from "@repo/types/src";

export const createGeminiPrompt = ({
  callStartedAt,
  messages,
  testAgentPrompt,
  scenario,
  analysis,
}: {
  callStartedAt?: string;
  messages: ArtifactMessagesItem[];
  testAgentPrompt: string;
  scenario: ScenarioWithIncludes;
  analysis: any;
}) => {
  return `
    You are an expert call analyst. Your job is to review the analysis of a junior analyst and make modifications if necessary.

    The call in question is between an AI agent (the main agent) and a test AI agent (the test agent).

    The junior analyst was tasked with finding errors in the main agent's performance using only the call transcript.

    Your job is to review the junior analyst's analysis against the audio of the call and make modifications if necessary.

    In particular, you should modify the following:
    - the errors  
      - you should determine if the errors are valid or not based off of the audio of the call
      - if the errors are not valid, you should remove them
        - for example, if the transcript indicates an imcomplete response from the main agent, but the audio indicates that the main agent was interrupted mid-sentence by the test agent, you should remove the error
        - if the transcript indicates a missing word -- but the audio indicates that the main agent did not miss a word, there must have been a transcription error and you should remove the error
      - if the errors are valid, you should keep them
      - your modification should be modifications that can only be made based off of the audio of the call.
      - do not remove errors that are factual errors -- only remove errors that are based off of a misunderstanding of the audio.


    You will be provided:
      1. a call transcript between two AI agents. The main agent will be labeled as "user" and the test agent will be labeled as "bot".
  
      2. the main agent's system prompt
      3. the test agent's prompt
      4. the success criteria for the call

      5. the junior analyst's analysis of the call
        - this is the analysis that you will be modifying
        - the format of the analysis is a a JSON with the following attributes:
          - success: A boolean indicating if the call was successful. The call is successful if the main agent achieves the success criteria.
          - failureReason: A short sentence CONCISELY describing the primary failure reason, if any -- else return null
          - errors: An array of objects, each representing an error that the main agent made. Each error object will have the following fields:
            - type: A string describing the type of error
            - description: A string describing the error - refer to the main agent only as "agent"
            - secondsFromStart: The start time of the error in seconds (use the secondsFromStart for this)
            - duration: The duration of the error in seconds (use duration for this)
      6. the audio of the call

      Return the modified analysis as a JSON object with the same format as the junior analyst's analysis.

      OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting

      Here you are: 

      TRANSCRIPT: ${messages}

      TEST AGENT PROMPT: ${testAgentPrompt}

      ${
        scenario.includeDateTime && scenario.timezone && callStartedAt
          ? `The call occurred at ${getDateTimeAtTimezone(
              new Date(callStartedAt),
              scenario.timezone,
            )}. Use this as context for your evaluation, if the evaluation criteria is dependent on the current date or time, or if it mentions phrases like 'right now' or 'today', etc.`
          : ""
      }

      MAIN AGENT GENERAL SUCCESS CRITERIA: ${[...scenario.evaluations]
        .map((evaluation) => evaluation.evaluationTemplate.name)
        .join(", ")}

      JUNIOR ANALYST'S ANALYSIS: ${JSON.stringify(analysis, null, 2)}
    `;
};
