import React from "react";

const ReferenceList = ({ references }) => {
  return (
    <div className="p-6 rounded-lg ">
      <h2 className="text-lg font-bold mb-1 text-gray-800">参考</h2>
      <ul className="px-8">
        {references.map((ref, index) => (
          <li key={index} className="list-disc border-blue-500">
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800 hover:font-bold transition-colors duration-200"
            >
              {ref.title}
            </a>
            {ref.author && (
              <span className="text-sm text-gray-600 ml-1">- {ref.author}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferenceList;
