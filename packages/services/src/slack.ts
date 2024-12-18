import axios from "axios";

export class SlackService {
  private env: {
    SLACK_ANALYTICS_BOT_WEBHOOK_URL: string;
  };

  constructor() {
    this.checkEnv();
    this.env = {
      SLACK_ANALYTICS_BOT_WEBHOOK_URL:
        process.env.SLACK_ANALYTICS_BOT_WEBHOOK_URL!,
    };
  }

  private checkEnv = () => {
    if (!process.env.SLACK_ANALYTICS_BOT_WEBHOOK_URL) {
      throw new Error("SLACK_ANALYTICS_BOT_WEBHOOK_URL is not set");
    }
  };

  sendAnalyticsMessage = async ({ message }: { message: string }) => {
    await axios.post(this.env.SLACK_ANALYTICS_BOT_WEBHOOK_URL, {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
      ],
    });
  };
}
