import Image from "next/image";

interface CustomerLogoProps {
  logo: string;
}

export function CustomerLogo({ logo }: CustomerLogoProps) {
  return (
    <div className="col-span-1 flex items-center justify-center">
      <div className="flex h-12 items-center justify-center">
        <Image
          src={logo}
          alt="Customer Logo"
          width={100}
          height={100}
          className="opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        />
      </div>
    </div>
  );
}
