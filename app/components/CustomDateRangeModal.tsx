import React, { useState } from "react";
import { Modal, DatePicker } from "antd";
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface CustomDateRangeModalProps {
  open: boolean;
  onClose: () => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  open,
  onClose,
  onDateRangeChange,
}) => {
  const [rangeDate, setRangeDate] = useState({
    startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const handleOk = () => {
    onDateRangeChange(rangeDate.startDate, rangeDate.endDate);
    onClose();
  };

  return (
    <Modal
      centered
      open={open}
      onOk={handleOk}
      onCancel={onClose}
    >
      <RangePicker 
        presets={[
          { label: '近10年', value: [dayjs().subtract(10, 'year'), dayjs()] },
          { label: '近30年', value: [dayjs().subtract(30, 'year'), dayjs()] },
          { label: '近50年', value: [dayjs().subtract(50, 'year'), dayjs()] },
        ]}
        defaultValue={[dayjs(rangeDate.startDate), dayjs(rangeDate.endDate)]}
        value={[dayjs(rangeDate.startDate), dayjs(rangeDate.endDate)]}
        onChange={(value, dateString) => {
          setRangeDate({
            startDate: dateString[0],
            endDate: dateString[1],
          });
        }} 
      />
    </Modal>
  );
};

export default CustomDateRangeModal;
