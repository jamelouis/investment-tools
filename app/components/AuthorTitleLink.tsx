import React from 'react';
import Image from "next/image";

const AuthorTitleLink = ({ author, title, href, summary }: {
  author: string;
  title: string;
  href: string;
  summary: string[];
}) => {
  return (
    <div 
      className="block p-4 mb-8 max-w-3xl rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200"
    >
      <div className="mb-8">
        <Image
          src="/value-application.jpg"
          alt="Value Application"
          width={400}
          height={300}
          layout="responsive"
        />
      </div>
    <a 
      href={href} 
    >
      <h2 className="text-xl font-semibold text-blue-600 hover:underline mb-2 page-header">
        {title}
      </h2>
      <p className="text-sm text-gray-600 top-nav">
        By <span className="font-medium">{author}</span>
      </p>
    </a>
    {summary.map((element, index) => (
      <p key={index} className='mt-4 text-xl text-gray-1000'>{element}</p>
    ))}
    <p className='text-center mt-4 text-sm text-gray-400'>由<a className='text-blue-400' href="">kimi</a>归纳总结</p>
    </div>
  );
};

export default AuthorTitleLink;