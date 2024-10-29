import axios from "axios";
import { env } from "~/env";

export const sendSocketMessage = async (
  userId: string,
  message: string,
): Promise<unknown> => {
  try {
    const response = await axios.post<unknown>(
      env.SOCKET_URL + "/api/message",
      {
        userId,
        message,
      },
    );
    if (response.status !== 200) {
      throw new Error("Failed to send message");
    }
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
