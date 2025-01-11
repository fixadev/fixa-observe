import { Button } from "~/components/ui/button";
import { env } from "~/env";

const userInfo = {
  id: env.NEXT_PUBLIC_SELF_HOSTED_USER_ID,
  firstName: "Self Hosted",
  lastName: "User",
  primaryEmailAddress: {
    emailAddress: "selfhosted@example.com",
  },
  publicMetadata: {
    stripeCustomerId: "123",
    freeTestsLeft: 100000000000000000000,
    slackWebhookUrl:
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
  },
  imageUrl: "https://via.placeholder.com/150",
  username: "selfhosted",
  reload: async () => {
    console.log("reload");
  },
};

export const useUser = () => {
  return {
    user: userInfo,
    isLoaded: true,
    isSignedIn: true,
  };
};

export const useOrganization = () => {
  return {
    organization: {
      id: env.NEXT_PUBLIC_SELF_HOSTED_ORGANIZATION_ID,
      name: "Self Hosted",
      publicMetadata: {
        stripeCustomerId: "123",
        freeTestsLeft: 100000000000000000000,
      },
    },
    isLoaded: true,
    isSignedIn: true,
  };
};

export const currentUser = async () => {
  return userInfo;
};

export const UserButton = () => {
  return <Button></Button>;
};
