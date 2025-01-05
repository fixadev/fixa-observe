import {
  Agent,
  GeneralEvaluationWithIncludes,
  ScenarioWithIncludes,
} from "@repo/types/src/index";

export const getScenariosWithGeneralEvals = async (
  agent: Agent & { generalEvaluations: GeneralEvaluationWithIncludes[] },
  scenario: ScenarioWithIncludes,
) => {
  const agentGeneralEvals = agent.generalEvaluations;

  const allEvals = [
    ...scenario.evaluations,
    ...agentGeneralEvals.map((ge) => ge.evaluation),
  ];

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
