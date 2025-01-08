import { Button } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "~/components/Logo";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function Footer() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 pb-32 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16 lg:pb-32">
        <div className="flex flex-col gap-2">
          <Logo />
          <ButtonRow />
        </div>
        <a href="https://elevenlabs.io/text-to-speech" target="_blank">
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
        <Link href="https://discord.gg/rT9cYkfybZ" target="_blank">
          <DiscordLogo />
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

function DiscordLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className="size-4 fill-current"
    >
      <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
    </svg>
  );
}
