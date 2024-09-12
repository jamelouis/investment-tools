import Image from "next/image";
import CustomImage, { getImagePath } from "./CustomImage";

const Footer = () => {
  return (
    <footer className="border-t-2 my-12 mx-6 sm:mx-6 lg:mx-12 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/investment.png`} alt="Investment 101 Logo" width={40} height={40} />
          <div className="ml-4">
            <h2 className="text-xl font-bold">投资101</h2>
            <p className="text-sm">在线工具箱平台</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/qrcode.png`} alt="WeChat QR Code" width={100} height={100} />
          <p className="mt-2 text-sm">扫码关注我们的微信公众号</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
