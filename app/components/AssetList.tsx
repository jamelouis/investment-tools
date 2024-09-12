import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RightCircleFilled } from "@ant-design/icons";

interface DataItem {
  group0: string;
  group1: string;
  group2: string;
  code: string;
  name: string;
  link: string;
}

const columns: ColumnsType<DataItem> = [
  { title: "大类别", dataIndex: "group0", key: "group0" },
  { title: "中类别", dataIndex: "group1", key: "group1" },
  { title: "小类别", dataIndex: "group2", key: "group2" },
  { title: "代码", dataIndex: "code", key: "code" },
  { title: "名称", dataIndex: "name", key: "name" },
  {
    title: "巨潮资讯网",
    dataIndex: "link",
    key: "link",
    render: (text) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        最新公告
      </a>
    ),
  },
];

const AssetLists: React.FC = ({ data }) => {
  return (
    <div>
      {/* Table for non-mobile screens */}
      <div className="hidden md:block">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>

      {/* Card list for mobile screens */}
      <div className="md:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-3 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="px-6 py-4 flex flex-row items-center justify-between">
              <div className="flex justify-start flex-col">
                <h2 className="text-sm font-bold text-gray-800 ">
                  {item.name}
                  <span className="text-gray-600">({item.code})</span>
                </h2>
                <div className="flex flex-row">
                  <span className="text-sm font-semibold text-gray-600"></span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 m-0.5 rounded-full">
                    {item.group0}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 m-0.5 rounded-full">
                    {item.group1}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 m-0.5 rounded-full">
                    {item.group2}
                  </span>
                </div>
              </div>
              <div className="">
                <a
                  href={`https://h5.1234567.com.cn/app/multi-platforms-fund/#/pages/fund-detail/index?id=${item.code}`}
                  title="Info"
                  className="text-blue-600 hover:text-blue-800 text-lg  w-10 h-10 font-medium transition-colors duration-300"
                >
                  <RightCircleFilled />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetLists;
