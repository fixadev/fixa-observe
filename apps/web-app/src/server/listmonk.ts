import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { env } from "~/env";

export async function addSubscriber(
  email: string,
  firstName?: string | null,
  lastName?: string | null,
) {
  try {
    const response = await axios.post(
      `${env.LISTMONK_URL}/api/subscribers`,
      {
        email,
        name: `${firstName} ${lastName}`,
        status: "enabled",
        lists: [env.LISTMONK_LIST_ID],
        attribs: {
          firstName,
          lastName,
        },
        preconfirm_subscriptions: true,
      },
      {
        auth: {
          username: env.LISTMONK_USERNAME,
          password: env.LISTMONK_PASSWORD,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

const transactionalTemplates = {
  welcome: 1,
  resetPassword: 2,
  verifyEmail: 3,
};

export async function sendEmail(
  email: string,
  template: keyof typeof transactionalTemplates,
) {
  try {
    const response = await axios.post(
      `${env.LISTMONK_URL}/api/tx`,
      {
        subscriber_email: email,
        template_id: transactionalTemplates[template],
      },
      {
        auth: {
          username: env.LISTMONK_USERNAME,
          password: env.LISTMONK_PASSWORD,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
