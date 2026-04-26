import Image from "next/image";
import { ImageField } from "@prismicio/client";

type Props = {
  image: ImageField | undefined | null;
  fallbackAlt: string;
};

export default function Banner({ image, fallbackAlt }: Props) {
  if (!image || !image.url) return null;
  const alt =
    image.alt && image.alt.trim().length > 0 ? image.alt : fallbackAlt;
  const width = image.dimensions?.width ?? 1200;
  const height = image.dimensions?.height ?? 628;
  return (
    <figure className="page-banner">
      <Image
        src={image.url}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </figure>
  );
}
