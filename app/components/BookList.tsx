"use client";

import React, { useState, useEffect } from 'react';
import { parse } from 'papaparse';
import { Table, Typography, Spin, Alert } from 'antd';
import bookLists from "@/data/book_lists.json";

const { Title } = Typography;

const BookList = ({ name }: { name: string }) => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("书单");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!name) return;

            const list = bookLists.find(list => list.name === name);
            if (!list) {
                setError('List not found');
                setLoading(false);
                return;
            }

            setTitle(list.title);

            try {
                const response = await fetch(list.url);
                const csvData = await response.text();
                const { data } = parse(csvData, { header: true });
                console.log(csvData, data);
                setBooks(data);
            } catch (err) {
                setError('Failed to fetch or parse CSV data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: '书名',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: '作者',
            dataIndex: 'Author',
            key: 'Author',
        },
        {
            title: '关键字',
            dataIndex: 'Keyword',
            key: 'Keyword',
            render: (text: string) => {
                if (text !== undefined && text.length !== 0) {
                    const tags = text.split(';');
                    tags.map(tag => console.log(tag));
                    return (
                        <div className='flex gap-2'>

                    {tags.map((tag: string) => {
                            return (
                                <span key={tag} className='bg-green-100 px-1 py-1 text-[0.75rem] text-green-900 border-green-400 border rounded'>{tag}</span>
                            )
                        }
                        )
                    }
                        </div>
                    )
                }
            }
        },
        {
            title: '链接',
            dataIndex: 'Link',
            key: 'Link',
            render: (_, record) => (
                <a href={record.Link} target="_blank" rel="noopener noreferrer">
                    {record.Title}
                </a>
            ),
        },
        {
            title: '搜索',
            key: 'Operation',
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    <a className="w-5 h-5 m-0" href={`https://search.douban.com/book/subject_search?search_text=${record.Name}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://img1.doubanio.com/favicon.ico" alt="豆瓣"></img>
                    </a>
                    <a className="w-5 h-5 m-0" href={`https://www.duozhuayu.com/search/book/${record.Name}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://asset.duozhuayu.com/logo.png" alt="多爪鱼"></img>
                    </a>
                </div>
            )
        }
    ];

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message="Error" description={error} type="error" showIcon />;

    return (
        <div className="bg-background max-w-5xl min-h-screen m-auto p-6">
            <Title level={2}>{title}</Title>
            <Table
                dataSource={books}
                columns={columns}
                rowKey={(record) => record.Name}
                pagination={false}
            />
        </div>
    );
};

export default BookList;