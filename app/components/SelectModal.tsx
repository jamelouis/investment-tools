import React, { useState } from "react";
import { Button, Modal, Table, Space } from "antd";
import SelectTable from "./SelectTable";
import DateRangePicker from "./DateRangePick";
import type { Dayjs } from 'dayjs';

const SelectModal = ({ name, data, onOk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seletedRows, setSelectedRows] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState(data);

  const showModal = () => {
    setIsModalOpen(true);
    setTableData(data);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onOk(seletedRows);
    setSelectedRowKeys([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRowKeys([]);
  };

  const onSelected = (rows) => {
    setSelectedRows(rows);
  };

  const onFilter = (dates) => {
    if(dates != null) {
    let datestr = dates.map((date) => {
      return date.format('YYYY/MM/DD');
    });
    let newTableData = data.filter(row => row.date.localeCompare(datestr[0]) > 0 && row.date.localeCompare(datestr[1]) <= 0);
    setTableData(newTableData);
  }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} disabled={data == null}>
        {name}
      </Button>
      <Modal
        title="选取交易"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        
          <Space direction="vertical" size={16}>
            <DateRangePicker onFilter={onFilter}/>
            <SelectTable
              data={tableData}
              onSelected={onSelected}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </Space>
        
      </Modal>
    </>
  );
};

export default SelectModal;
