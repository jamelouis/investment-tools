import React, { useState } from 'react';
import { DatePicker, Space, Typography, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const DateRangePicker: React.FC = ({onFilter}) => {
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <Space direction="horizontal" size={16}>
      <RangePicker
        value={dates || value}
       
        onCalendarChange={(val) => setDates(val)}
        onChange={(val) => setValue(val)}
        onOpenChange={onOpenChange}
      />
      <Button type="primary" onClick={()=> { console.log(value); onFilter(value)}}>Search</Button>
    </Space>
  );
};

export default DateRangePicker;