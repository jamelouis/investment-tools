import React, { useState } from 'react';
import { Divider, Radio, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  date: string;
  value: number;
  pe: number;
  pb: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '日期',
    dataIndex: 'date',
    render: (text: string) => <a>{text}</a>,
    sorter: (a: DataType, b: DataType) =>  a.date.localeCompare(b.date),
  },
  {
    title: '市值',
    dataIndex: 'value',
  },
  {
    title: 'PE',
    dataIndex: 'pe',
    render: (pe: number) => pe.toFixed(2),
    sorter: (a: DataType, b: DataType) =>  a.pe - b.pe,
  },
  {
    title: 'PB',
    dataIndex: 'pb',
    render: (pb: number) => pb.toFixed(2),
    sorter: (a: DataType, b: DataType) =>  a.pb - b.pb,
  },
];

// rowSelection object indicates the need for row selection


const SelectTable: React.FC = ({data, onSelected, selectedRowKeys, setSelectedRowKeys}) => {
    const rowSelection = {
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
          onSelected(selectedRows);
          setSelectedRowKeys(newSelectedRowKeys);
        },
        selectedRowKeys
      };

      if(data === null) return <>loading</>
    let realData = data.map((item, index) =>{
        item['key']=index;
        return item;
    });
    
  return (
    <div>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={realData}
      />
    </div>
  );
};

export default SelectTable;