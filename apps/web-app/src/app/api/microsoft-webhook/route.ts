import { type NextRequest } from "next/server";
import { db } from "~/server/db";
import { emailService } from "~/server/services/email";

export async function GET() {
  return new Response("ok", { status: 200 });
}

const emailServiceInstance = emailService({ db });

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const validationToken = searchParams.get("validationToken");

  if (validationToken) {
    return new Response(validationToken, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const requestBody = (await req.json()) as {
    value: {
      subscriptionId: string;
      subscriptionExpirationDateTime: string;
      changeType: string;
      resource: string;
      resourceData: {
        id: string;
      };
    }[];
  };

  // console.log("microsoft webhook", JSON.stringify(requestBody, null, 2));

  if (!requestBody.value[0]) {
    return new Response("No value in request body", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const userId = await emailServiceInstance.getUserIdFromSubscriptionId({
    subscriptionId: requestBody.value[0].subscriptionId,
  });
  await emailServiceInstance.addEmailToDb({
    userId,
    emailId: requestBody.value[0].resourceData.id,
  });

  return new Response("ok", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// Example payload:
// {
//   "value": [
//     {
//       "subscriptionId": "5de4e914-e32c-4171-91f9-d5d827528d90",
//       "subscriptionExpirationDateTime": "2024-10-08T05:38:04+00:00",
//       "changeType": "created",
//       "resource": "Users/14744c48beb04ffd/Messages/AQMkADAwATMwMAExLTgzYTktZjU4ZC0wMAItMDAKAEYAAAMGebr8D_uKTJrbB7qwap4OBwA2NgAmu1uDX0i8cnt0kXghsgAAAgEMAAAANjYAJrtbg19IvHJ7dJF4IbIAAAACzDqVAAAA",
//       "resourceData": {
//         "@odata.type": "#Microsoft.Graph.Message",
//         "@odata.id": "Users/14744c48beb04ffd/Messages/AQMkADAwATMwMAExLTgzYTktZjU4ZC0wMAItMDAKAEYAAAMGebr8D_uKTJrbB7qwap4OBwA2NgAmu1uDX0i8cnt0kXghsgAAAgEMAAAANjYAJrtbg19IvHJ7dJF4IbIAAAACzDqVAAAA",
//         "@odata.etag": "W/\"CQAAABYAAAA2Nia7W4NfSLxye3SReCGyAAACyi1N\"",
//         "id": "AQMkADAwATMwMAExLTgzYTktZjU4ZC0wMAItMDAKAEYAAAMGebr8D_uKTJrbB7qwap4OBwA2NgAmu1uDX0i8cnt0kXghsgAAAgEMAAAANjYAJrtbg19IvHJ7dJF4IbIAAAACzDqVAAAA"
//       },
//       "clientState": null,
//       "tenantId": ""
//     }
//   ]
// }
