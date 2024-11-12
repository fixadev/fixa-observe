export const generateInboundIntentsPrompt = `your job is to create intents to test an inbound AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create three intents that will be used to create other agents that will be used to test the phone agent. 
  your response will be an array of JSON objects with the following properties:

  - name: the name of the intent -- don't use underscores or other special characters
  - instructions: the instructions for the intent
  - successCriteria: what criteria need to be met for a conversation with this intent to be considered successful -- make this as specific as possible

  i.e. if the system prompt is "your are an assistant that answers the phone at a restaurant", 
  
  you might create the following intents:
  {
    "name": "make a reservation",
    "instructions": "make a reservation, specifically ask for a reservation at 8pm on Friday, and ask about the cancellation policy",
    "successCriteria": "the reservation is successfully booked"
  },
  {
    "name": "ask about the menu",
    "instructions": "ask about the menu, specifically ask about the specials and the vegetarian options",
    "successCriteria": "the menu is successfully described -- including the specials and the vegetarian options"
  },
  {
    "name": "order delivery",
    "instructions": "place an order for delivery, add a special request for extra pickles on the burger",
    "successCriteria": "the order is successfully placed -- including the special request for extra pickles on the burger"
  }
  `;

export const generateOutboundIntentsPrompt = `your job is to create intents to test an outbound AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create three intents that will be used to create other agents that answer calls from the outboundphone agent. 
  your response will be an array of JSON objects with the following properties:

  - name: the name of the intent -- don't use underscores or other special characters
  - instructions: the instructions for the intent
  - successCriteria: what criteria need to be met for a conversation with this intent to be considered successful -- make this as specific as possible

  i.e. if the system prompt is "your are an sales agent that calls potential customers to sell a product", 
  
  you might create the following intents:
  {
    "name": "ask about the product",
    "instructions": "ask about the product, specifically ask about the features and the benefits",
    "successCriteria": "the product is successfully described -- including the features and the benefits"
  },
  {
    "name": "be skeptical of the product quality",
    "instructions": "ask about the quality of the product, specifically ask about the quality and the durability",
    "successCriteria": "the quality is successfully described -- including the quality and the durability"
  },
  {
    "name": "ask about the price",
    "instructions": "ask about the price, specifically ask about the price and the payment options",
    "successCriteria": "the price is successfully described -- including the price and the payment options"
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
