import { Agent, Eval, Scenario } from "@prisma/client";

export const getScenariosWithGeneralEvals = async (
  agent: Agent & { enabledGeneralEvals: Eval[] },
  scenario: Scenario & { evals: Eval[] },
) => {
  const agentGeneralEvals = agent.enabledGeneralEvals;
  const filteredAgentGeneralEvals = agentGeneralEvals;

  // const filteredAgentGeneralEvals = agentGeneralEvals.filter(
  //   (evaluation) =>
  //     !evalOverrides.find((override) => override.evalId === evaluation.id)
  //       ?.enabled === false,
  // );

  const allEvals = [...scenario.evals, ...filteredAgentGeneralEvals];

  const preparedEvals = allEvals.map((evaluation) => ({
    ...evaluation,
    description:
      evaluation.contentType === "tool"
        ? "this tool should be called whenever: " + evaluation.description
        : evaluation.description,
  }));

  const scenarioWithGeneralEvals = {
    ...scenario,
    evals: preparedEvals,
  };

  return scenarioWithGeneralEvals;
};
