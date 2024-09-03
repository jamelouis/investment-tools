"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string[];
}

import category_tools from "@/data/category_tools.json";
import toolsData from '../data/tools.json';

const CategoryTool = ({icon, title, category, selected_category, onClicked} : 
  { 
    icon: string, 
    title: string, 
    category: string,
    selected_category: string,
    onClicked: (category: string) => {} 
  }) => {
  return (
    <li className="ml-5 mr-3 ">
      <button 
        className={`text-primary flex items-center w-full h-10 hover:bg-gray-300 transition-colors duration-200 ${category !== selected_category ? "" : "bg-gray-300 border-l-4 border-primary"}`}
        onClick={() => onClicked(category)}
      >
        <img className="w-5 h-5 ml-5 mr-3" src={icon} alt={title} />
        <span>{title}</span>
      </button>
    </li>
  );
};

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setTools(toolsData as Tool[]);
  }, []);

 const filterTools = selectedCategory === 'all' ? tools :
                     tools.filter(({category}) => category.includes(selectedCategory)); 


  return (
    <>
      <header className="fixed h-screen w-[240px] bg-background">
        <div className="flex mt-[40px] ml-[30px] pb-[30px] items-center"> {/* Added items-center */}
          <img src="/investment.png" alt="logo" className="w-[30px] h-[30px] mr-[23px]"></img>
          <div>
            <h2 className="text-primary text-lg">投资101</h2>
            <p className="text-secondary text-sm">在线工具箱平台</p>
          </div>
        </div>
        <nav className="text-white">
          <ul className="flex flex-col gap-6">
            {category_tools.map(({ icon, title, category}) => {
              return <CategoryTool key={category} icon={icon} title={title} category={category} selected_category={selectedCategory} onClicked={(category: string) => setSelectedCategory(category)} />
            })}
          </ul>
        </nav>
      </header>
      <main className="pl-[240px]">
        <div className="min-h-screen bg-background-light">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">工具箱</h1>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filterTools.map((tool) => (
                <Link href={`/tool/${tool.id}`} key={tool.id}>
                  <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="px-4 py-5 sm:p-6">
                      {tool.image &&
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
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </main>
      <footer className="bg-gray-800 text-white py-4 px-8 text-center">
        <p>&copy; 2022 Investment 101</p>
      </footer>
    </>
  );
}
