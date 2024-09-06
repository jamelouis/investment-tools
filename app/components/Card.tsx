import Image from "next/image";
import { Tool } from "../types";

interface CardProps {
  tool: Tool;
}

const Card: React.FC<CardProps> = ({ tool }) => {
  return (
    <div className="w-[252px] h-[278px] flex bg-[#f0f2ef] border-1 rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="p-4 flex flex-col">
        <div
          className={`flex items-center justify-center relative h-[140px] w-[220px] ${
            tool.image ? "" : "bg-white"
          }`}
        >
          {tool.image ? (
            <Image
              src={tool.image}
              alt={tool.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <span className="text-center font-bold">{tool.name}</span>
          )}
        </div>
        <h3 className="text-[1rem] font-semibold text-gray-900 mt-4 mb-2">
          {tool.name.length > 12 ? `${tool.name.substring(0, 12)}...` : tool.name}
        </h3>
        <p className="text-[0.875rem] text-gray-600">
          {tool.description.length > 42
            ? `${tool.description.substring(0, 42)}...`
            : tool.description}
        </p>
      </div>
    </div>
  );
};

export default Card;
