import { db } from "../db";
import { emailService } from "./email";

async function testDraftEmails() {
  const emailServiceInstance = emailService({ db });
  const drafts = [];
  for (let i = 0; i < 50; i++) {
    const draft = {
      senderName: "Jonathan Liu",
      senderEmail: "jonytf@outlook.com",

      to: "colin@getbrochure.com",
      subject: "Test email",
      body: "Test email body",

      propertyId: "23895521-27d8-4bc5-bf6d-569f3fb11444",
      attributesToVerify: ["askingRate", "opEx"],
    };
    drafts.push(draft);
  }

  const startTime = performance.now();
  const result = await emailServiceInstance.createDraftEmails({
    userId: "user_2nDyxKALTCkw2Z9GfzKSWshUNGp",
    drafts,
  });
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`Creating draft emails took ${duration} milliseconds`);

  console.log("drafts created! num emails", result.length);
}

void testDraftEmails();
