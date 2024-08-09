import React, { useState } from "react";
import { Radio, Space } from "antd";
import CustomDateRangeModal from "./CustomDateRangeModal";
import moment from 'moment';

interface ChartControlsProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  timeFrame,
  onTimeFrameChange,
  onDateRangeChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDateRangeChange = (value: string) => {
    let startDate, endDate;
    if (value === 'current') {
      startDate = moment().startOf('year').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    } else if (value === 'custom') {
      setModalOpen(true);
      return;
    } else {
      const years = parseInt(value);
      startDate = moment().subtract(years, 'year').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }
    onDateRangeChange(startDate, endDate);
  };

  return (
    <div className="flex items-center justify-center">
      <Space>
        <Radio.Group
          onChange={(e) => onTimeFrameChange(e.target.value)}
          value={timeFrame}
          style={{ marginBottom: "20px" }}
        >
          <Radio.Button value="day">Day</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>

        <Radio.Group
          defaultValue="current"
          onChange={(e) => handleDateRangeChange(e.target.value)}
          style={{ marginBottom: "20px" }}
        >
          <Radio.Button value="current">今年</Radio.Button>
          <Radio.Button value="1Y">近1年</Radio.Button>
          <Radio.Button value="3Y">近3年</Radio.Button>
          <Radio.Button value="5Y">近5年</Radio.Button>
          <Radio.Button value="custom">自定义</Radio.Button>
        </Radio.Group>
      </Space>
      <CustomDateRangeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  );
};

export default ChartControls;
