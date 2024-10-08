import { env } from "~/env";
import { GoogleAuth } from "google-auth-library";

export const taskService = () => {
  const gcloudCreds = JSON.parse(env.GCLOUD_CREDS) as {
    client_email: string;
    private_key: string;
    project_id: string;
  };
  const googleAuth = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/cloud-tasks",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
    credentials: {
      client_email: gcloudCreds.client_email,
      private_key: gcloudCreds.private_key,
      project_id: gcloudCreds.project_id,
    },
  });

  const getClient = async () => {
    const client = await googleAuth.getClient();
    return client;
  };

  return {
    createTask: async (
      date: Date,
      httpRequest: {
        httpMethod: string;
        url: string;
        headers: Record<string, string>;
        body: string;
      },
    ) => {
      const client = await getClient();
      const accessToken = await client.getAccessToken();
      await client.request({
        url: "https://cloudtasks.googleapis.com/v2/projects/pixa-website/locations/us-central1/queues/renewEmailSubscription/tasks",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
        data: JSON.stringify({
          task: {
            scheduleTime: date.toISOString(),
            httpRequest: httpRequest,
          },
        }),
      });
    },
  };
};

// function test() {
//   const taskServiceInstance = taskService();
//   void taskServiceInstance.createTask(
//     new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
//     {
//       httpMethod: "POST",
//       url: `${env.NEXT_PUBLIC_API_URL}/api/renew-email-subscription`,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: btoa(
//         JSON.stringify({
//           userId: "user_2n5FpA1zkaQHLb8OHSMdwEEJt8i",
//         }),
//       ),
//     },
//   );
// }

// test();
