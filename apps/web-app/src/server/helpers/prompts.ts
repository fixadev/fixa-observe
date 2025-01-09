import {
  EvaluationGroupWithIncludesSchema,
  EvaluationSchema,
  type EvaluationTemplate,
  EvaluationTemplateSchema,
} from "@repo/types/src/index";

export const generateCheckIfOutboundPrompt = (
  prompt: string,
) => `your job is to determine if system prompt is for an outbound or inbound phone agent.

your response will be a JSON object with the following properties:
- isOutbound: true if the system prompt is for an outbound phone agent, false otherwise

examples: 
- inbound: "your are an assistant that answers the phone at a restaurant"
- outbound: "your are an sales agent that calls potential customers to sell a product"
- inbound: "your are an assistant that books medical appointments"
- outbound: "your are a lead qualification agent that calls potential customers to qualify them for a product"

Here's the system prompt: 

${prompt}`;

export const generateEvaluationGroupsPrompt = (
  count: number,
  existingEvaluationTemplates: EvaluationTemplate[],
) => `your job is to create ${count} evaluation groups to test an AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create ${count} evaluation groups that will be used to test the phone agent. 

  evaluation groups are of type ${JSON.stringify(EvaluationGroupWithIncludesSchema.describe("Evaluation Group Schema"), null, 2)}
  at a high level, each evaluation group includes:
  - evaluations: an array of evaluation objects of type ${JSON.stringify(EvaluationSchema.describe("Evaluation Schema"), null, 2)} 
  - each evaluation inherits from an evaluation template of type ${JSON.stringify(EvaluationTemplateSchema.describe("Evaluation Template Schema"), null, 2)}

  here are the existing evaluation templates which you can use to create new evaluations
  
  ${JSON.stringify(existingEvaluationTemplates, null, 2)}
  
  you can create new templates as needed.

  your response will be an array of JSON objects with the following properties:

  - evaluationTemplatesToCreate: an array of evaluation templates to create
  - evaluationGroups: an array of evaluation groups to create -- each evaluation group should include evaluations that inherit from existing evaluation templates or evaluation templates that will be created

  i.e. if the system prompt is "your are an assistant that answers the phone at a restaurant", 
  
  you might create the following scenarios:
  {
    "evaluationTemplatesToCreate": [
      {
        "type": "CONVERSATION",
        "resultType": "BOOLEAN", 
        "contentType": "TEXT",
        "id": "temp-1",
        "name": "book reservation",
        "description": "the agent successfully books a reservation {{time}} for {{num_people}} people under the {{name}}",
        "params": [
          {
            "name": "name",
            "type": "string",
            "description": "the name of the person making the reservation"
          },
          {
            "name": "num_people",
            "type": "number",
            "description": "the number of people in the reservation"
          },
          {
            "name": "time",
            "type": "string",
            "description": "the time the user requests for the reservation"
          }
        ],
        "toolCallExpectedResult": "",
        "ownerId": null,
        "deleted": false
      }
    ],
    "evaluationGroups": [
      {
        "id": "group-1",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "ownerId": "system",
        "name": "Reservation Booking",
        "condition": "the user tries to book a reservation",
        "enabled": true,
        "savedSearchId": null,
        "evaluations": [
          {
            "id": "eval-1",
            "evaluationTemplateId": "temp-1",
            "name": "book reservation",
            "type": "boolean"
          }
        ]
      }
    ]
  }
  `;
