export const generateInboundScenariosPrompt = (
  numberOfScenarios: number,
) => `your job is to create ${numberOfScenarios} scenarios to test an inbound AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create ${numberOfScenarios} scenarios that will be used to create other agents that will be used to test the phone agent. 
  your response will be an array of JSON objects with the following properties:

  - name: the name of the scenario -- don't use underscores or other special characters
  - instructions: the instructions for the scenario
  - successCriteria: what criteria need to be met for a conversation with this scenario to be considered successful -- make this as specific as possible

  i.e. if the system prompt is "your are an assistant that answers the phone at a restaurant", 
  
  you might create the following scenarios:
  {
    "name": "make a reservation",
    "instructions": "make a reservation, specifically ask for a reservation at 8pm on Friday for 2 people under the name John Smith, and ask about the cancellation policy",
    "evals": [
      {
        "name": "book reservation",
        "description": "the agent successfully books a reservation at 8pm on Friday for 2 people under the name John Smith",
        "type": "boolean"
      },
      {
        "name": "describe cancellation policy",
        "description": "the agent successfully describes the cancellation policy",
        "type": "boolean"
      }
    ]
  },
  {
    "name": "ask about the menu",
    "instructions": "ask about the menu, specifically ask about the specials and the vegetarian options",
    "evals": [
      {
        "name": "describe specials",
        "description": "the agent successfully describes the daily specials",
        "type": "boolean"
      },
      {
        "name": "describe vegetarian options", 
        "description": "the agent successfully describes the vegetarian menu options",
        "type": "boolean"
      }
    ]
  },
  {
    "name": "order delivery",
    "instructions": "place an order for delivery, add a special request for extra pickles on the burger",
    "evals": [
      {
        "name": "place order",
        "description": "the agent successfully takes the delivery order",
        "type": "boolean"
      },
      {
        "name": "special request",
        "description": "the agent correctly notes the special request for extra pickles on the burger",
        "type": "boolean"
      }
    ]
  }
  `;

export const generateOutboundScenariosPrompt = (
  numberOfScenarios: number,
) => `your job is to create ${numberOfScenarios} scenarios to test an outbound AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create ${numberOfScenarios} scenarios that will be used to create other agents that answer calls from the outbound phone agent. 
  your response will be an array of JSON objects with the following properties:

  - name: the name of the scenario -- don't use underscores or other special characters
  - instructions: the instructions for test agent. in this case the test agent will be answering a call from the outbound phone agent
  - evals: an array of eval objects. that specify criteria for the agent to pass. each eval object has the following properties:
    - name: the name of the eval
    - description: a description of the eval
    - type: the type of eval. set this to boolean

  i.e. if the system prompt is "your are an sales agent that calls potential customers to sell CRM software", 
  
  you might create the following scenarios:
  {
    "name": "ask about the product",
    "instructions": "ask about the product, specifically ask about the features and the benefits",
    "evals": [
      {
        "name": "describe CRM",
        "description": "the agent successfully describes the CRM, including it's industry leading use of AI to automate sales tasks",
        "type": "boolean"
      }, 
      {
        "name": "close sale",
        "description": "the agent successfully closes the sale",
        "type": "boolean"
      }
    ]
  },
  {
    "name": "be skeptical of the product quality",
    "instructions": "ask about the quality of the product, specifically ask about the quality and the durability",
    "evals": [
      {
        "name": "address quality concerns",
        "description": "the agent successfully addresses concerns about product quality and durability with specific examples and evidence",
        "type": "boolean"
      },
      {
        "name": "build confidence", 
        "description": "the agent builds customer confidence in the product's reliability and longevity",
        "type": "boolean"
      },
      {
        "name": "schedule a demo",
        "description": "the agent successfully schedules a demo with the customer",
        "type": "boolean"
      }
    ]
  },
  {
    "name": "ask about the price",
    "instructions": "ask about the price, specifically ask about the price and the payment options",
    "evals": [
      {
        "name": "explain pricing",
        "description": "the agent clearly explains the pricing structure and available payment options",
        "type": "boolean"
      },
      {
        "name": "demonstrate value",
        "description": "the agent successfully demonstrates the value proposition and justifies the price point",
        "type": "boolean"
      },
      {
        "name": "close sale",
        "description": "the agent overcomes price objections and persuades the customer to make a purchase",
        "type": "boolean"
      }
    ]
  }
  `;

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
