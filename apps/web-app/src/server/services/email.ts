import { Prisma, type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
// import { db } from "../db";

const outlookApiUrl = "https://graph.microsoft.com/v1.0";
const clerkApiUrl = "https://api.clerk.com/v1";

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

  return {
    getEmailThread: async (emailThreadId: string) => {
      const emailThread = await db.emailThread.findUnique({
        where: { id: emailThreadId },
        include: { emails: true, property: true },
      });
      return emailThread;
    },

    // Sends an email
    sendEmail: async ({
      userId,

      senderName,
      senderEmail,

      to,
      subject,
      body,

      propertyId,
    }: {
      userId: string;
      senderName: string;
      senderEmail: string;
      to: string;
      subject: string;
      body: string;
      propertyId: string;
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

      // Send email
      await axios.post(
        `${outlookApiUrl}/me/messages/${id}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );

      // Create email thread
      await db.emailThread.create({
        data: {
          id: conversationId,
          propertyId,
        },
      });

      // Save email to database
      await db.email.create({
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
        },
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

      // Get last email in thread
      // const emailThread = await db.emailThread.findUnique({
      //   where: { id: emailThreadId },
      //   include: { emails: true },
      // });
      // if (!emailThread) {
      //   throw new Error("Email thread not found");
      // }
      // if (emailThread.emails.length === 0) {
      //   throw new Error("No emails found in thread");
      // }
      // const lastEmail = emailThread.emails[emailThread.emails.length - 1]!;

      // Reply to last email in thread
      await axios.post(
        `${outlookApiUrl}/me/messages/${emailId}/replyAll`,
        {
          comment: body,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId", outlook.body-content-type="text"`,
          },
        },
      );
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

      // Update email thread
      try {
        await db.emailThread.update({
          where: { id: conversationId },
          data: { unread: true },
        });
      } catch (error) {
        // Check if the error is due to the record not existing
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          console.log(
            `Email thread with id ${conversationId} not found. Skipping update.`,
          );
          return; // Exit the function if the email thread doesn't exist
        }
        // If it's a different error, rethrow it
        throw error;
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
      await db.email.upsert({
        where: { id: emailId },
        update: email,
        create: email,
      });
    },

    subscribeToEmails: async ({ userId }: { userId: string }) => {
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

      // TODO: Create task to renew email subscription (google cloud tasks or something)
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
      infoToVerify,
      subject,
      body,
    }: {
      userId: string;
      infoToVerify: string[];
      subject: string;
      body: string;
    }) => {
      await db.emailTemplate.upsert({
        where: { userId },
        update: {
          infoToVerify,
          subject,
          body,
        },
        create: {
          userId,
          infoToVerify,
          subject,
          body,
        },
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
