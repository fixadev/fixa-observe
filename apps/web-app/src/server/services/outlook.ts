import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
import { db } from "../db";

const outlookApiUrl = "https://graph.microsoft.com/v1.0";
const clerkApiUrl = "https://api.clerk.com/v1";

export const outlookService = ({ db }: { db: PrismaClient }) => {
  const getAccessToken = async (clerkId: string) => {
    const response = await axios.get<{ token: string; scopes: string[] }[]>(
      `${clerkApiUrl}/users/${clerkId}/oauth_access_tokens/oauth_microsoft`,
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
      clerkId,

      senderName,
      senderEmail,

      to,
      subject,
      body,

      propertyId,
    }: {
      clerkId: string;
      senderName: string;
      senderEmail: string;
      to: string;
      subject: string;
      body: string;
      propertyId: string;
    }) => {
      const accessToken = await getAccessToken(clerkId);

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
      clerkId,
      emailId,
      body,
    }: {
      clerkId: string;
      emailId: string;
      body: string;
    }) => {
      const accessToken = await getAccessToken(clerkId);

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
      clerkId,
      emailId,
    }: {
      clerkId: string;
      emailId: string;
    }) => {
      const accessToken = await getAccessToken(clerkId);

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
      }>(
        `${outlookApiUrl}/me/messages/${emailId}?$select=subject,sender,toRecipients,receivedDateTime,uniqueBody,conversationId,webLink`,
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
      } = response.data;

      await db.emailThread.upsert({
        where: { id: conversationId },
        update: { unread: true },
        create: { id: conversationId, unread: true },
      });

      // Create email
      await db.email.create({
        data: {
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
        },
      });
    },
  };
};

// function testOutlook() {
//   const outlookServiceInstance = outlookService({ db });

//   void outlookServiceInstance.sendEmail({
//     clerkId: "user_2n3BwIeVxJF5zPpoREHCcDQOSTj",
//     senderName: "Jonathan Liu",
//     senderEmail: "jonytf@outlook.com",
//     to: "liu.z.jonathan@gmail.com",
//     subject: "Test email",
//     body: "This is a test email",
//     propertyId: "d70e38a1-74c9-43de-ba6d-b8f7bc8baf4d",
//   });
// }

// function testReplyToEmail() {
//   const outlookServiceInstance = outlookService({ db });

//   void outlookServiceInstance.replyToEmail({
//     clerkId: "user_2n3BwIeVxJF5zPpoREHCcDQOSTj",
//     emailId:
//       "AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0ANjYmu1uDX0i8cnt0kXghsgAAAXV3kgAA",
//     body: "this is so incredibly ugly. like wtf is this",
//   });
// }

// function testAddEmailToDb() {
//   const outlookServiceInstance = outlookService({ db });

//   void outlookServiceInstance.addEmailToDb({
//     clerkId: "user_2n3BwIeVxJF5zPpoREHCcDQOSTj",
//     emailId:
//       "AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0ANjYmu1uDX0i8cnt0kXghsgAAAXV3fQAA",
//   });
// }

// testOutlook();
// testReplyToEmail();
// testAddEmailToDb();
