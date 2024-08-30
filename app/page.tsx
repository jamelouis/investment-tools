"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  image?: string;
}

import toolsData from '../data/tools.json';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    setTools(toolsData as Tool[]);
  }, []);

  console.log(tools);

  return (
    <>
    <div className="min-h-screen bg-gray-100">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">工具箱</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={`/tool/${tool.id}`} key={tool.id}>
            <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="px-4 py-5 sm:p-6">
                { tool.image &&  
              <div className="relative h-48 w-full mb-2">
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                }
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
    </>
  );
}
