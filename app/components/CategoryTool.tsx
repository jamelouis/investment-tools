import Image from "next/image";

interface CategoryToolProps {
  icon: string;
  title: string;
  category: string;
  selected_category: string;
  onClicked: (category: string) => void;
}

const CategoryTool: React.FC<CategoryToolProps> = ({
  icon,
  title,
  category,
  selected_category,
  onClicked,
}) => {
  return (
    <li className="ml-5 mr-3 ">
      <button
        className={`text-primary flex items-center w-full h-10 hover:bg-gray-300 transition-colors duration-200 ${
          category !== selected_category ? "" : "bg-gray-300 border-l-4 border-primary"
        }`}
        onClick={() => onClicked(category)}
      >
        <Image
          src={icon}
          alt={title}
          width={20}
          height={20}
          className="ml-5 mr-3"
        />
        <span>{title}</span>
      </button>
    </li>
  );
};

export default CategoryTool;
