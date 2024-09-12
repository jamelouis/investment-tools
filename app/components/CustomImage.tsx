import React from "react";
import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string; // Added alt property
}

const CustomImage = React.forwardRef<HTMLImageElement, CustomImageProps>((props, ref) => {
  console.log( process.env.NEXT_PUBLIC_BASE_PATH)
  const src = process.env.NEXT_PUBLIC_BASE_PATH + props.src;
  return <Image ref={ref} {...props} src={src} alt={props.alt} />; // Pass alt to Image
});

// Add display name for the component
CustomImage.displayName = "CustomImage";

export default CustomImage;

export const getImagePath = (src: string) => {
  return process.env.NEXT_PUBLIC_BASE_PATH + src;
}