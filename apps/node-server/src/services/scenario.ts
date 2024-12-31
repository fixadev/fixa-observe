import { Agent, Scenario } from "@prisma/client";
import { EvaluationWithIncludes } from "@repo/types/src";

export const getScenariosWithGeneralEvals = async (
  agent: Agent & { enabledGeneralEvaluations: EvaluationWithIncludes[] },
  scenario: Scenario & { evaluations: EvaluationWithIncludes[] },
) => {
  const agentGeneralEvals = agent.enabledGeneralEvaluations;
  const filteredAgentGeneralEvals = agentGeneralEvals;

  // const filteredAgentGeneralEvals = agentGeneralEvals.filter(
  //   (evaluation) =>
  //     !evalOverrides.find((override) => override.evalId === evaluation.id)
  //       ?.enabled === false,
  // );

  const allEvals = [...scenario.evaluations, ...filteredAgentGeneralEvals];

  const preparedEvals = allEvals.map((evaluation) => ({
    ...evaluation,
    description:
      evaluation.evaluationTemplate?.contentType === "tool"
        ? "this tool should be called whenever: " +
          evaluation.evaluationTemplate?.description
        : evaluation.evaluationTemplate?.description,
  }));

  const scenarioWithGeneralEvals = {
    ...scenario,
    evaluations: preparedEvals,
  };

  return scenarioWithGeneralEvals;
};
