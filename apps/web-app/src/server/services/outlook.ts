import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
// import { db } from "../db";

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
            Prefer: `IdType="ImmutableId"`,
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
            Prefer: `IdType="ImmutableId"`,
          },
        },
      );

      // Create email thread
      await db.emailThread.create({
        data: {
          id: conversationId,
          propertyId,
          subject,
        },
      });

      // Save email to database
      await db.email.create({
        data: {
          emailThreadId: conversationId,
          senderName,
          senderEmail,
          recipientName: to,
          recipientEmail: to,
          body,
          webLink,
        },
      });
    },

    replyToEmail: async ({
      clerkId,
      lastEmailId, // The ID of the last email in the thread
      body,
    }: {
      clerkId: string;
      lastEmailId: string;
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
        `${outlookApiUrl}/me/messages/${lastEmailId}/replyAll`,
        {
          message: {
            body: {
              contentType: "Text",
              content: body,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `IdType="ImmutableId"`,
          },
        },
      );
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
//     lastEmailId:
//       "AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0ANjYmu1uDX0i8cnt0kXghsgAAAXV1iQAA",
//     body: "This is a test reply",
//   });
// }

// testOutlook();
// testReplyToEmail();
