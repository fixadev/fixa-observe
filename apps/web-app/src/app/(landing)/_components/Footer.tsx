import { Button } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "~/components/Logo";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function Footer() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <div className="flex flex-col gap-2">
          <Logo />
          <ButtonRow />
        </div>
        <a href="https://elevenlabs.io/text-to-speech">
          <Image
            src="https://storage.googleapis.com/eleven-public-cdn/images/elevenlabs_grants_white.png"
            alt="Text to Speech"
            width={250 * 0.75}
            height={29 * 0.75}
          />
        </a>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" asChild>
            <Link
              href="mailto:contact@fixa.dev"
              className="flex flex-row items-center gap-2"
              target="_blank"
            >
              <EnvelopeIcon className="size-4" />
              contact@fixa.dev
            </Link>
          </Button>
        </div>
        {/* <h2 className="text-3xl font-extrabold lowercase tracking-tight text-white sm:text-4xl">
          <span className="block">ready to improve your voice agents?</span>
          <span className="block text-gray-400">
            start testing and fixing today
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <Button size="lg">get started</Button>
        </div> */}
      </div>
    </div>
  );
}

function ButtonRow() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" asChild>
        <Link href="https://www.linkedin.com/company/pixa-dev" target="_blank">
          <LinkedInLogoIcon className="size-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <Link href="https://x.com/fixa_dev" target="_blank">
          <XLogo />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <Link
          href="https://join.slack.com/t/fixacommunity/shared_invite/zt-2wbw79829-01HGYT7SxVYPk8t6pTNb9w"
          target="_blank"
        >
          <SlackLogo />
        </Link>
      </Button>
    </div>
  );
}

function XLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="size-4 fill-current"
    >
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg
      viewBox="0 0 2447.6 2452.5"
      xmlns="http://www.w3.org/2000/svg"
      className="size-4 fill-current"
    >
      <g clip-rule="evenodd" fill-rule="evenodd">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" />
        <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" />
        <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" />
        <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" />
      </g>
    </svg>
  );
}
