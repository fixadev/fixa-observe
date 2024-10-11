import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
import { extractAttributes } from "../utils/extractAttributes";
import { taskService } from "./task";
import { JSDOM } from "jsdom";
// import { db } from "../db";

const outlookApiUrl = "https://graph.microsoft.com/v1.0";
const clerkApiUrl = "https://api.clerk.com/v1";

const taskServiceInstance = taskService();

export const emailService = ({ db }: { db: PrismaClient }) => {
  const getAccessToken = async (userId: string) => {
    const response = await axios.get<{ token: string; scopes: string[] }[]>(
      `${clerkApiUrl}/users/${userId}/oauth_access_tokens/oauth_microsoft`,
      {
        headers: {
          Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
        },
      },
    );
    return response.data[0]!.token;
  };

  const getFileAttachments = async ({
    userId,
    emailId,
  }: {
    userId: string;
    emailId: string;
  }) => {
    const accessToken = await getAccessToken(userId);

    const response = await axios.get<{
      value: {
        "@odata.type": string;
        id: string;
        name: string;
        contentType: string;
        size: number;
      }[];
    }>(
      `${outlookApiUrl}/me/messages/${emailId}/attachments?$select=id,name,contentType,size`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'IdType="ImmutableId"',
        },
      },
    );

    const fileAttachments = response.data.value.filter(
      (attachment) =>
        attachment["@odata.type"] === "#microsoft.graph.fileAttachment",
    );
    return fileAttachments;
  };

  return {
    getEmailThread: async (emailThreadId: string) => {
      const emailThread = await db.emailThread.findUnique({
        where: { id: emailThreadId },
        include: { emails: true, property: true },
      });
      return emailThread;
    },

    // Creates a draft email
    createDraftEmail: async ({
      userId,

      senderName,
      senderEmail,

      to,
      subject,
      body,

      propertyId,
      attributesToVerify,
    }: {
      userId: string;
      senderName: string;
      senderEmail: string;
      to: string;
      subject: string;
      body: string;
      propertyId: string;
      attributesToVerify: string[];
    }) => {
      const accessToken = await getAccessToken(userId);

      // Create draft email
      const response = await axios.post<{
        id: string;
        conversationId: string;
        webLink: string;
      }>(
        `${outlookApiUrl}/me/messages`,
        {
          subject,
          body: {
            contentType: "Text",
            content: body,
          },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );
      const { id, conversationId, webLink } = response.data;

      const parsedAttributes: Record<string, string | null> = {};
      for (const attributeId of attributesToVerify) {
        parsedAttributes[attributeId] = null;
      }

      // Create email thread
      const emailThread = await db.emailThread.create({
        data: {
          id: conversationId,
          propertyId,
          parsedAttributes,
        },
      });

      // Save email to database
      const email = await db.email.create({
        data: {
          id,
          emailThreadId: conversationId,
          senderName,
          senderEmail,
          recipientName: to,
          recipientEmail: to,
          subject,
          body,
          webLink,
          isDraft: true,
        },
      });

      return {
        email,
        emailThread: { ...emailThread, emails: [email] },
      };
    },

    updateDraftEmail: async ({
      userId,
      emailId,

      to,
      subject,
      body,
    }: {
      userId: string;
      emailId: string;
      to: string;
      subject: string;
      body: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      await axios.patch(
        `${outlookApiUrl}/me/messages/${emailId}`,
        {
          subject,
          body: {
            contentType: "Text",
            content: body,
          },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );

      // Save email to database
      const email = await db.email.update({
        where: { id: emailId },
        data: {
          recipientName: to,
          recipientEmail: to,
          subject,
          body,
        },
      });
      return { email };
    },

    // Sends an email
    sendEmail: async ({
      userId,
      emailId,
    }: {
      userId: string;
      emailId: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      // Send email
      await axios.post(
        `${outlookApiUrl}/me/messages/${emailId}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );

      // Update email
      await db.email.update({
        where: { id: emailId },
        data: {
          createdAt: new Date(),
          isDraft: false,
        },
      });
    },

    // Deletes an email based on its id
    deleteEmail: async ({
      userId,
      emailId,
    }: {
      userId: string;
      emailId: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      // Delete email from Outlook
      await axios.delete(`${outlookApiUrl}/me/messages/${emailId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Prefer: `IdType="ImmutableId"`,
        },
      });

      // Delete email from database
      await db.email.delete({
        where: { id: emailId },
      });
    },

    // Deletes an entire email thread
    deleteEmailThread: async ({
      userId,
      emailThreadId,
    }: {
      userId: string;
      emailThreadId: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      // Fetch all emails in the thread
      const emailThread = await db.emailThread.findUnique({
        where: { id: emailThreadId },
        include: { emails: true },
      });

      if (!emailThread) {
        throw new Error("Email thread not found");
      }

      // Delete each email in the thread
      for (const email of emailThread.emails) {
        // Delete email from Outlook
        await axios.delete(`${outlookApiUrl}/me/messages/${email.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId"`,
          },
        });

        // Delete email from database
        await db.email.delete({
          where: { id: email.id },
        });
      }

      // Delete the email thread from the database
      await db.emailThread.delete({
        where: { id: emailThreadId },
      });
    },

    // Replies to the given email
    replyToEmail: async ({
      userId,
      emailId,
      body,
    }: {
      userId: string;
      emailId: string;
      body: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      const response = await axios.post<{
        id: string;
        conversationId: string;
        webLink: string;
        body: {
          content: string;
        };
        sender: {
          emailAddress: {
            name: string;
            address: string;
          };
        };
        toRecipients: {
          emailAddress: {
            name: string;
            address: string;
          };
        }[];
        subject: string;
      }>(
        `${outlookApiUrl}/me/messages/${emailId}/createReplyAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId"`,
          },
        },
      );
      const {
        id,
        conversationId,
        webLink,
        body: draftBody,
        subject,
        sender,
        toRecipients,
      } = response.data;

      // Parse the draftBody.content as HTML using jsdom
      const dom = new JSDOM(draftBody.content);
      const doc = dom.window.document;

      // Find the <body> tag
      const bodyTag = doc.querySelector("body");

      if (bodyTag) {
        // Insert "body" at the beginning of the <body> tag
        bodyTag.insertAdjacentHTML(
          "afterbegin",
          body.split("\n").join("<br>") + "<br>",
        );

        // Update draftBody.content with the modified HTML
        draftBody.content = doc.documentElement.outerHTML;
      }

      await axios.patch(
        `${outlookApiUrl}/me/messages/${id}`,
        {
          body: {
            contentType: "html",
            content: draftBody.content,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId"`,
          },
        },
      );

      // Send email
      await axios.post(
        `${outlookApiUrl}/me/messages/${id}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId"`,
          },
        },
      );

      // Save email to database
      await db.email.create({
        data: {
          id,
          emailThreadId: conversationId,
          senderName: sender.emailAddress.name,
          senderEmail: sender.emailAddress.address,
          recipientName: toRecipients[0]!.emailAddress.name,
          recipientEmail: toRecipients[0]!.emailAddress.address,
          subject,
          body: body,
          webLink,
        },
      });
    },

    // Gets an email with the given ID and adds it to the database
    addEmailToDb: async ({
      userId,
      emailId,
    }: {
      userId: string;
      emailId: string;
    }) => {
      const accessToken = await getAccessToken(userId);

      // Get email details
      const response = await axios.get<{
        id: string;
        subject: string;
        receivedDateTime: string;
        conversationId: string;
        webLink: string;
        sender: {
          emailAddress: {
            name: string;
            address: string;
          };
        };
        toRecipients: {
          emailAddress: {
            name: string;
            address: string;
          };
        }[];
        uniqueBody: {
          content: string;
        };
        isDraft: boolean;
      }>(
        `${outlookApiUrl}/me/messages/${emailId}?$select=subject,sender,toRecipients,receivedDateTime,uniqueBody,conversationId,webLink,isDraft`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );

      const {
        subject,
        sender,
        toRecipients,
        receivedDateTime,
        uniqueBody,
        conversationId,
        webLink,
        isDraft,
      } = response.data;

      if (isDraft) {
        console.log(`Email with id ${emailId} is a draft. Skipping update.`);
        return; // Exit the function if the email is a draft
      }

      // Check if email thread exists
      const emailThread = await db.emailThread.findUnique({
        where: { id: conversationId },
      });
      if (!emailThread) {
        console.log(
          `Email thread with id ${conversationId} not found. Skipping update.`,
        );
        return;
      }

      // Check if email already exists
      const existingEmail = await db.email.findUnique({
        where: { id: emailId },
      });
      if (existingEmail) {
        console.log(
          `Email with id ${emailId} already exists. Skipping creation.`,
        );
        return;
      }

      // Create email
      const email = {
        id: emailId,
        createdAt: new Date(receivedDateTime),
        emailThreadId: conversationId,

        senderName: sender.emailAddress.name,
        senderEmail: sender.emailAddress.address,
        // TODO: Make recipient an array
        recipientName: toRecipients[0]!.emailAddress.name,
        recipientEmail: toRecipients[0]!.emailAddress.address,

        subject,
        body: uniqueBody.content,

        webLink,
      };
      await db.email.create({
        data: email,
      });

      // Get attachments
      const attachments = await getFileAttachments({ userId, emailId });
      await db.attachment.createMany({
        data: attachments.map((attachment) => ({
          id: attachment.id,
          name: attachment.name,
          contentType: attachment.contentType,
          size: attachment.size,
          emailId,
        })),
      });

      // Mark email thread as unread
      await db.emailThread.update({
        where: { id: conversationId },
        data: { unread: true },
      });

      // Get user
      const user = await db.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }

      // Only extract attributes if the email is NOT from the user's email address
      if (user.email !== sender.emailAddress.address) {
        // Extract updated attributes
        const attributesToUpdate = await extractAttributes(uniqueBody.content);
        const propertyToUpdate = await db.property.findUnique({
          where: { id: emailThread.propertyId },
        });

        if (!propertyToUpdate) {
          throw new Error("Property not found");
        }

        // update property attributes
        for (const attributeId of Object.keys(attributesToUpdate)) {
          if (
            propertyToUpdate?.attributes &&
            typeof propertyToUpdate.attributes === "object" &&
            attributesToUpdate[attributeId] !== null
          ) {
            (
              propertyToUpdate.attributes as Record<
                string,
                string | null | undefined
              >
            )[attributeId] = attributesToUpdate[attributeId];
          }
        }
        await db.property.update({
          where: { id: emailThread.propertyId },
          data: {
            attributes: propertyToUpdate?.attributes ?? {},
          },
        });

        // Update email thread with attributes
        await db.emailThread.update({
          where: { id: conversationId },
          data: {
            parsedAttributes: attributesToUpdate,
          },
        });
      }
    },

    createEmailSubscription: async ({ userId }: { userId: string }) => {
      const accessToken = await getAccessToken(userId);

      const payload = {
        changeType: "created",
        notificationUrl: `${env.NEXT_PUBLIC_API_URL}/api/microsoft-webhook`,
        resource: "me/messages",
        expirationDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const response = await axios.post<{ id: string }>(
        `${outlookApiUrl}/subscriptions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: 'IdType="ImmutableId"',
          },
        },
      );

      await db.user.update({
        where: { id: userId },
        data: {
          emailSubscriptionId: response.data.id,
          emailSubscriptionExpiresAt: payload.expirationDateTime,
        },
      });

      // Create task to renew email subscription
      await taskServiceInstance.createTask(payload.expirationDateTime, {
        httpMethod: "POST",
        url: `${env.NEXT_PUBLIC_API_URL}/api/renew-email-subscription`,
        headers: {
          "Content-Type": "application/json",
        },
        body: btoa(
          JSON.stringify({
            userId,
          }),
        ),
      });
    },

    deleteEmailSubscription: async ({ userId }: { userId: string }) => {
      const accessToken = await getAccessToken(userId);
      const user = await db.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.emailSubscriptionId) {
        throw new Error("User does not have an email subscription");
      }

      await axios.delete(
        `${outlookApiUrl}/subscriptions/${user.emailSubscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      await db.user.update({
        where: { id: userId },
        data: {
          emailSubscriptionId: null,
          emailSubscriptionExpiresAt: null,
        },
      });
    },

    getUserIdFromSubscriptionId: async ({
      subscriptionId,
    }: {
      subscriptionId: string;
    }) => {
      const user = await db.user.findFirst({
        where: { emailSubscriptionId: subscriptionId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.id;
    },

    getEmailTemplate: async ({ userId }: { userId: string }) => {
      const emailTemplate = await db.emailTemplate.findUnique({
        where: { userId },
      });
      return emailTemplate;
    },

    // Updates the email template for the given user
    updateEmailTemplate: async ({
      userId,
      subject,
      body,
    }: {
      userId: string;
      subject: string;
      body: string;
    }) => {
      await db.emailTemplate.upsert({
        where: { userId },
        update: {
          subject,
          body,
        },
        create: {
          userId,
          subject,
          body,
        },
      });
    },

    updateEmailThread: async ({
      emailThreadId,
      unread,
    }: {
      userId: string;
      emailThreadId: string;
      unread: boolean;
    }) => {
      await db.emailThread.update({
        where: { id: emailThreadId },
        data: { unread },
      });
    },
  };
};

// function testSend() {
//   const emailServiceInstance = emailService({ db });

//   void emailServiceInstance.sendEmail({
//     userId: "user_2n5FpA1zkaQHLb8OHSMdwEEJt8i",
//     senderName: "Jonathan Liu",
//     senderEmail: "jonytf@outlook.com",
//     to: "liu.z.jonathan@gmail.com",
//     subject: "Test email",
//     body: "This is a test email",
//     propertyId: "d70e38a1-74c9-43de-ba6d-b8f7bc8baf4d",
//   });
// }

// function testReplyToEmail() {
//   const emailServiceInstance = emailService({ db });

//   void emailServiceInstance.replyToEmail({
//     userId: "user_2n5FpA1zkaQHLb8OHSMdwEEJt8i",
//     emailId:
//       "AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0ANjYmu1uDX0i8cnt0kXghsgAAAXV3kgAA",
//     body: "this is so incredibly ugly. like wtf is this",
//   });
// }

// function testAddEmailToDb() {
//   const emailServiceInstance = emailService({ db });

//   void emailServiceInstance.addEmailToDb({
//     userId: "user_2n5FpA1zkaQHLb8OHSMdwEEJt8i",
//     emailId:
//       "AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0ANjYmu1uDX0i8cnt0kXghsgAAAXV7sAAA",
//   });
// }

// testSend();
// testReplyToEmail();
// testAddEmailToDb();

// async function testEmailParsing(propertyId: string, emailText: string) {
//     const attributesToUpdate = await extractAttributes(emailText);
//     console.log('Attributes to update', attributesToUpdate)
//     const propertyToUpdate = await db.property.findUnique({
//       where: { id: propertyId },
//     });

//     if (!propertyToUpdate) {
//       throw new Error("Property not found");
//     }

//     // update property attributes
//     for (const attributeId of Object.keys(attributesToUpdate)) {
//       if (propertyToUpdate?.attributes && typeof propertyToUpdate.attributes === 'object') {
//         (propertyToUpdate.attributes as Record<string, string | undefined>)[attributeId] = attributesToUpdate[attributeId];
//       }
//     }
//     await db.property.update({
//       where: { id: propertyId },
//       data: {
//         attributes: propertyToUpdate?.attributes ?? {},
//       },
//     });
// }

// const email = `Hi Colin, the place is available starting from November 10th.
//   the rent is $5.50 NNN
//   the opex is $0.50

//   Best,

//   Andrew`

// const propertyId = 'f71b6745-b42b-43be-9af0-9546f88cd85d'

// void testEmailParsing(propertyId, email)
