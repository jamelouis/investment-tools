import React from "react";
import Image from "next/image";

const CustomImage = React.forwardRef((props, ref) => {
  const src = process.env.NEXT_PUBLIC_BASE_PATH + props.src;
  return <Image ref={ref} {...props} src={src} />;
});

export default CustomImage;