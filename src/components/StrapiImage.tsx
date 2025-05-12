import Image from "next/image";

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return <Image src={imageUrl} alt={alt} className={className} {...rest} />;
}

  export function getStrapiMedia(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return process.env.NEXT_PUBLIC_API?.replace(/\/$/, "") + url;
}

  
  