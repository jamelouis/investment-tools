"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Header from "./components/Header";
import { Tool } from "./types";
import category_tools from "@/data/category_tools.json";
import toolsData from "../data/tools.json";

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setTools(toolsData as Tool[]);
  }, []);

  const filterTools =
    selectedCategory === "all"
      ? tools
      : tools.filter(({ category }) => category.includes(selectedCategory));

  const getCategoryTitle = (category: string) => {
    const category_tool = category_tools.find((ct) => ct.category === category);
    return category_tool ? category_tool.title : "未知类别";
  };

  const title = getCategoryTitle(selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="md:pl-[240px]">
        <div className="min-h-screen bg-background-light">
          <div className="max-w-7xl mx-auto py-12 px-6 sm:px-6 lg:px-12">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {title}
            </h1>
            <div className="flex flex-cols flex-wrap justify-center lg:justify-between gap-6 items-center flex-grow">
              {filterTools.map((tool) => (
                <Link href={`/tool/${tool.id}`} key={tool.id} title={tool.name}>
                  <Card tool={tool} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
