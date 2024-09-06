import React from "react";

const ReferenceItem = ({ title, url }) => (
  <li className="mb-2 p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow duration-200">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-blue-600 hover:underline"
    >
      <span>{title}</span>
    </a>
  </li>
);

const References = ({ data }) => (
  <div className="max-w-md mx-auto mt-6 p-4 bg-gray-50 rounded-lg">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">References</h2>
    <ul>
      {data.map(({ title, url }) => (
        <ReferenceItem key={title} title={title} url={url} />
      ))}
    </ul>
  </div>
);

export default References;
