import Image from "next/image";
import CategoryTool from "./CategoryTool";
import category_tools from "@/data/category_tools.json";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <header className="bg-background">
      <div className="flex justify-start pt-9 pb-4 items-center z-10 md:hidden">
        <button onClick={() => setIsMenuOpen(true)}>
          <img src="menu.png" alt="menu" className="w-5 h-5 mx-6" />
        </button>
        <div className="flex items-center">
          <img
            src="investment.png"
            alt="logo"
            className="w-[30px] h-[30px] mr-3"
          />
          <div>
            <h2 className="text-primary text-lg">投资101</h2>
            <p className="text-secondary text-sm">在线工具箱平台</p>
          </div>
        </div>
      </div>
      <div
        className={`fixed z-50 top-0 left-0 h-screen w-[240px] bg-background md:block ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex mt-[40px] ml-[30px] pb-[30px] items-center">
          <img
            src="investment.png"
            alt="logo"
            className="w-[30px] h-[30px] mr-[23px]"
          />
          <div>
            <h2 className="text-primary text-lg">投资101</h2>
            <p className="text-secondary text-sm">在线工具箱平台</p>
          </div>
        </div>
        <nav className="text-white">
          <ul className="flex flex-col gap-6">
            {category_tools.map(({ icon, title, category }) => (
              <CategoryTool
                key={category}
                icon={icon}
                title={title}
                category={category}
                selected_category={selectedCategory}
                onClicked={onCategoryClick}
              />
            ))}
          </ul>
        </nav>
      </div>
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-gray-500 opacity-10 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
