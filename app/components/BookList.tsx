"use client";

import React, { useState, useEffect } from "react";
import { parse } from "papaparse";
import { Table, Typography, Spin, Alert, Card } from "antd";
import bookLists from "@/data/book_lists.json";

const { Title } = Typography;

// BookList component for displaying a list of books based on a given name
const BookList = ({ name }: { name: string }) => {
  // State variables for managing component data and UI
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("书单");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Async function to fetch and parse CSV data
    const fetchData = async () => {
      if (!name) return;

      // Find the corresponding book list from the imported JSON data
      const list = bookLists.find((list) => list.name === name);
      if (!list) {
        setError("List not found");
        setLoading(false);
        return;
      }

      setTitle(list.title);

      try {
        // Fetch CSV data from the URL specified in the book list
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_PATH}/${list.url}`,
        );
        const csvData = await response.text();
        // Parse CSV data using PapaParse library
        const { data } = parse(csvData, { header: true });
        console.log(csvData, data);
        setBooks(data.filter((d) => d.Name));
      } catch (err) {
        setError("Failed to fetch or parse CSV data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Define table columns with custom renderers for specific fields
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "书名",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "作者",
      dataIndex: "Author",
      key: "Author",
    },
    {
      title: "关键字",
      dataIndex: "Keyword",
      key: "Keyword",
      // Custom renderer for keywords, splitting them into tags
      render: (text: string) => {
        if (text !== undefined && text.length !== 0) {
          const tags = text.split(";");
          tags.map((tag) => console.log(tag));
          return (
            <div className="flex gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-green-100 px-1 py-1 text-[0.75rem] text-green-900 border-green-400 border rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        }
      },
    },
    {
      title: "链接",
      dataIndex: "Link",
      key: "Link",
      // Render link as clickable anchor tag
      render: (_, record) => (
        <a href={record.Link} target="_blank" rel="noopener noreferrer">
          {record.Title}
        </a>
      ),
    },
    {
      title: "搜索",
      key: "Operation",
      // Render search links for Douban and Duozhuayu
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <a
            className="w-5 h-5 m-0"
            href={`https://search.douban.com/book/subject_search?search_text=${record.Name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img1.doubanio.com/favicon.ico" alt="豆瓣"></img>
          </a>
          <a
            className="w-5 h-5 m-0"
            href={`https://www.duozhuayu.com/search/book/${record.Name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://asset.duozhuayu.com/logo.png" alt="多爪鱼"></img>
          </a>
        </div>
      ),
    },
  ];

  // New function to render a single book card
  const renderBookCard = (book) => (
    <Card
      key={book.Name}
      className="mb-2 shadow-md"
      title={
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg">{book.Name}</h3>
          <div className="flex items-center gap-3">
            <a
              href={`https://search.douban.com/book/subject_search?search_text=${book.Name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500"
            >
              <img
                className="w-3 h-3"
                src="https://img1.doubanio.com/favicon.ico"
                alt="豆瓣"
              ></img>
            </a>
            <a
              href={`https://www.duozhuayu.com/search/book/${book.Name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500"
            >
              <img
                className="w-3 h-3"
                src="https://asset.duozhuayu.com/logo.png"
                alt="多爪鱼"
              ></img>
            </a>
          </div>
        </div>
      }
    >
      <p>
        <strong>作者:</strong> {book.Author}
      </p>
      {book.Keyword && (
        <div className="mt-2 flex flex-row items-center">
          <strong className="pr-3">关键字:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {book.Keyword.split(";").map((tag) => (
              <span
                key={tag}
                className="inline-block bg-green-100 px-1 py-1 text-xs text-green-900 border-green-400 border rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {book.Link && (
        <div className="">
          <span className="text-sm pr-3">来自:</span>
          <a
            href={book.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-500"
          >
            {book.Title}
          </a>
        </div>
      )}
    </Card>
  );

  // Conditional rendering based on component state
  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  // Render the book list table
  return (
    <div className="bg-background max-w-5xl min-h-screen m-auto p-6">
      <Title level={2}>{title}</Title>
      {/* Desktop view (table) */}
      <div className="hidden md:block">
        <Table
          dataSource={books}
          columns={columns}
          rowKey={(record) => record.Name}
          pagination={false}
        />
      </div>
      {/* Mobile view (cards) */}
      <div className="md:hidden">
        {books.map((book) => (book.Name ? renderBookCard(book) : ""))}
      </div>
    </div>
  );
};

export default BookList;
