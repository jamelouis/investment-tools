import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Modal, Select, message } from 'antd';

const { Option } = Select;

interface DataSourceItem {
  key: string;
  date_at_buy: string;
  value_at_buy: number;
  pe_at_buy: number;
  date_at_sell: string;
  value_at_sell: number;
  pe_at_sell: number;
  totalGain: number;
  annualizedReturn: number;
}

interface AdvancedLocalStorageUIProps {
  dataSource: DataSourceItem[];
  setDataSource: React.Dispatch<React.SetStateAction<DataSourceItem[]>>;
}

const AdvancedLocalStorageUI: React.FC<AdvancedLocalStorageUIProps> = ({ dataSource, setDataSource }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'save' | 'load'>('save');
  const [saveName, setSaveName] = useState<string>('');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const updateSavedItemsList = useCallback(() => {
    const items = Object.keys(localStorage).filter(key => key.startsWith('table_'));
    setSavedItems(items.map(item => item.replace('table_', '')));
  }, []);

  useEffect(() => {
    updateSavedItemsList();
  }, [updateSavedItemsList]);

  const handleSave = () => {
    setModalMode('save');
    setIsModalVisible(true);
  };

  const handleLoad = () => {
    setModalMode('load');
    setIsModalVisible(true);
    updateSavedItemsList();
  };

  const handleModalOk = () => {
    if (modalMode === 'save') {
      localStorage.setItem(`table_${saveName}`, JSON.stringify(dataSource));
      message.success(`Saved table as "${saveName}"`);
      setSaveName('');
      updateSavedItemsList();
    } else if (modalMode === 'load') {
      const loadedValue = localStorage.getItem(`table_${selectedItem}`);
      if (loadedValue) {
        setDataSource(JSON.parse(loadedValue));
        message.success(`Loaded table "${selectedItem}"`);
      }
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSaveName('');
    setSelectedItem('');
  };

  const columns = [
    {
      title: "买入日期",
      dataIndex: "date_at_buy",
      key: "date_at_buy",
    },
    {
      title: "买入值",
      dataIndex: "value_at_buy",
      key: "value_at_buy",
    },
    {
      title: "买入PE",
      dataIndex: "pe_at_buy",
      key: "pe_at_buy",
      render: (pe) => pe.toFixed(2),
    },
    {
      title: "卖出日期",
      dataIndex: "date_at_sell",
      key: "date_at_sell",
    },
    {
      title: "卖出值",
      dataIndex: "value_at_sell",
      key: "value_at_sell",
    },
    {
      title: "卖出PE",
      dataIndex: "pe_at_sell",
      key: "pe_at_sell",
      render: (pe) => pe.toFixed(2),
    },
    {
      title: "总收益率",
      dataIndex: "totalGain",
      key: "totalGain",
      render: (ar) => `${(ar * 100).toFixed(2)}%`,
    },
    {
      title: "年化收益率",
      dataIndex: "annualizedReturn",
      key: "annualizedReturn",
      render: (ar) => `${(ar * 100).toFixed(2)}%`,
    },
  ];

  return (
    <div className='mt-4'>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleLoad}>Load</Button>
        <Button danger onClick={() => setDataSource([])}>Reset</Button>
      </div>
      <Table<DataSourceItem> dataSource={dataSource} columns={columns} />
      <Modal
        title={modalMode === 'save' ? 'Save table' : 'Load table'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {modalMode === 'save' ? (
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter a name for this table"
          />
        ) : (
          <Select
            style={{ width: '100%' }}
            placeholder="Select an item to load"
            onChange={(value: string) => setSelectedItem(value)}
          >
            {savedItems.map((item) => (
              <Option key={item} value={item}>{item}</Option>
            ))}
          </Select>
        )}
      </Modal>
    </div>
  );
};

export default AdvancedLocalStorageUI;