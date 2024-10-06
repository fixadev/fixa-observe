import { type PrismaClient } from "@prisma/client";
import axios from "axios";

const outlookApiUrl = "https://graph.microsoft.com/v1.0";
const clerkApiUrl = "https://api.clerk.com/v1";

export const outlookService = ({ db }: { db: PrismaClient }) => {
  const getAccessToken = async (clerkId: string) => {
    const response = await axios.get<{ token: string; scopes: string[] }[]>(
      `${clerkApiUrl}/users/${clerkId}/oauth_access_tokens/oauth_microsoft`,
    );
    console.log("token", response.data[0]!.token);
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

    sendEmail: async (
      clerkId: string,
      to: string,
      subject: string,
      body: string,
    ) => {
      const accessToken = await getAccessToken(clerkId);

      // Create draft email
      const response = await axios.post<{ id: string; conversationId: string }>(
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
          },
        },
      );
      const { id, conversationId } = response.data;

      // Send email
      await axios.post(
        `${outlookApiUrl}/me/messages/${id}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return conversationId;
    },
  };
};
