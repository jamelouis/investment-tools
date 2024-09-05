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

const CategoryTool = ({ icon, title, category, selected_category, onClicked }:
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

const Card = ({ tool }: { tool: Tool }) => {
  return (
    <div className="w-[252px] h-[278px] flex bg-[#f0f2ef] border-1 rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="p-4 flex flex-col">
        {(
          <div className={`flex items-center justify-center relative h-[140px] w-[220px] ${tool.image ? "" : "bg-white"}`}>
            { tool.image ? 
            <Image
              src={tool.image?tool.image:""}
              alt={tool.name}
              layout="fill"
              objectFit="cover"
            />
            :
            <span className="text-center font-bold">{tool.name}</span>
           }
          </div>
        )}
        <h3 className="text-[1rem] font-semibold text-gray-900 mt-4 mb-2">{tool.name.length > 12 ? `${tool.name.substring(0, 12)}...` : tool.name}</h3>
        <p className="text-[0.875rem] text-gray-600">{tool.description.length > 42 ? `${tool.description.substring(0, 42)}...` : tool.description}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setTools(toolsData as Tool[]);
  }, []);

  const filterTools = selectedCategory === 'all' ? tools :
    tools.filter(({ category }) => category.includes(selectedCategory));

  const getCategoryTitle = (category: string) => {
    const category_tool = category_tools.find(ct=> ct.category === category);
    return category_tool ? category_tool.title: '未知类别';
  };

  const title = getCategoryTitle(selectedCategory);

  return (
    <>
      <header className="bg-background">
        <div className="flex justify-start pt-9 pb-4 items-center z-10 md:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <img src="menu.png" alt="menu" className="w-5 h-5 mx-6"></img>
          </button>
          <div className="flex items-center">
            <img src="investment.png" alt="logo" className="w-[30px] h-[30px] mr-3"></img>
            <div>
              <h2 className="text-primary text-lg">投资101</h2>
              <p className="text-secondary text-sm">在线工具箱平台</p>
            </div>
          </div>
        </div>
        <div className={`fixed z-50 top-0 left-0 h-screen w-[240px] bg-background md:block ${(isMenuOpen? "block" : "hidden")}`}>
          <div className="flex mt-[40px] ml-[30px] pb-[30px] items-center"> {/* Added items-center */}
            <img src="investment.png" alt="logo" className="w-[30px] h-[30px] mr-[23px]"></img>
            <div>
              <h2 className="text-primary text-lg">投资101</h2>
              <p className="text-secondary text-sm">在线工具箱平台</p>
            </div>
          </div>
          <nav className="text-white">
            <ul className="flex flex-col gap-6">
              {category_tools.map(({ icon, title, category }) => {
                return <CategoryTool key={category} icon={icon} title={title} category={category} selected_category={selectedCategory} onClicked={
                  (category: string) => {
                    setSelectedCategory(category) 
                    if(isMenuOpen) setIsMenuOpen(false);
                  }
                }
                  />
              })}
            </ul>
          </nav>
        </div>
        { isMenuOpen && 
          <div className="fixed top-0 left-0 w-screen h-screen bg-gray-500 opacity-10 z-30" onClick={() => setIsMenuOpen(false)}></div>
        }
      </header>
      <main className="md:pl-[240px]">
        <div className="min-h-screen bg-background-light">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">{title}</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4">
              {filterTools.map((tool) => (
                <Link href={`/tool/${tool.id}`} key={tool.id} title={tool.name}>
                  <Card tool={tool} />
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
