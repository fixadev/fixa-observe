"use client";

import { useUser } from "~/helpers/useSelfHostedAuth";
import Image from "next/image";

export default function UserImage({
  imageUrl,
  width = 50,
  height = 50,
}: {
  imageUrl?: string;
  width?: number;
  height?: number;
}) {
  const { user } = useUser();

  let _imageUrl = imageUrl;
  if (!_imageUrl) {
    if (!user) {
      return null;
    }

    _imageUrl = user.imageUrl;
  }

  const params = new URLSearchParams({
    height: height.toString(),
    width: width.toString(),
    quality: "100",
    fit: "crop",
  });

  const imageSrc = _imageUrl + "?" + params.toString();

  return (
    <div>
      <Image
        className="rounded-full"
        src={imageSrc}
        alt="user profile picture"
        width={width}
        height={height}
      />
    </div>
  );
}
