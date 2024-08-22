import React, { useState, useRef } from "react";
import { DualAxes } from "@ant-design/plots";
import { Space, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SelectModal from "./SelectModal";
import AdvancedLocalStorageUI from "./AdvancedLocalStorageUI";
import PageToImageExporter from "./PageToImageExporter";
import ChartControls from "./ChartControls";
import { useChartData } from "./DataFetcher";
import { getChartConfig } from "./ChartConfig";
import { calcGains } from "../../lib/utils";
import { useChartDataFromFile } from "./DataLoader";
import FileUploader from "./Upload";
import moment from "moment";
import AuthorTitleLink from "./AuthorTitleLink";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton, Divider } from 'antd';

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import dayjs from "dayjs";

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: 'h2', popover: { title: '工具缘起', description: '估值工具来源于该文章内容' } },
    { element: '.top-nav', popover: { title: 'Title', description: 'Description' } },
    { element: '.file-upload', popover: { title: '上传文件', description: '点击按钮，在目录中选取数据文件上床；或者选中数据文件，拖到文件上传区域。' } },
    { element: '.footer', popover: { title: 'Title', description: 'Description' } },
  ]
});

function startTheMagicShow() {
  driverObj.drive();
}

const DualAxisChart: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  const [timeFrame, setTimeFrame] = useState("month");
  const [startDate, setStartDate] = useState(moment().startOf('year').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [dataSource, setDataSource] = useState([]);
  const dataRef = useRef();
  const dataSourceRef = useRef();

 // const { data, isLoading } = useChartData();
 
  const { data, isLoading, error, loadFile } = useChartDataFromFile();

  const handleFileLoad = (file: File) => {
    loadFile(file);
    setShowChart(true);
  };
  const handleGoBack = () => {
    setShowChart(false);
    setStartDate(moment().startOf('year').format('YYYY-MM-DD'));
    setEndDate(moment().format('YYYY-MM-DD'));
    setDataSource([]);
    setTimeFrame("month");
  };
  const handleTimeFrameChange = (newTimeFrame) => setTimeFrame(newTimeFrame);
  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleAdd = (rows) => {
    const lastItem = dataRef.current[dataRef.current.length - 1];
    if (!lastItem) return;

    const newRows = rows.map((row) => ({
      date_at_buy: row.date,
      value_at_buy: row.value,
      pe_at_buy: row.pe,
      date_at_sell: lastItem.date,
      value_at_sell: lastItem.value,
      pe_at_sell: lastItem.pe,
    }));

    const updatedDataSource = [...dataSourceRef.current, ...newRows].map((row, index) => {
      const { totalGain, annualizedReturn } = calcGains(
        new Date(row.date_at_buy),
        row.value_at_buy,
        new Date(row.date_at_sell),
        row.value_at_sell
      );
      return { ...row, key: index, totalGain, annualizedReturn };
    });

    setDataSource(updatedDataSource.sort((a, b) => a.date_at_buy.localeCompare(b.date_at_buy)));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const chartData = data
    ? (timeFrame === "day" ? data.days : (timeFrame === "month" ? data.months : data.years))
    : null;
  const fakeData = [
    {
      "date": dayjs().startOf('year').format('YYYY/MM/DD'), 
      "cp": 4699.28,
      "r_cp": 5720.56,
      "pe_ttm.mcw": 20.11136649001735,
      "pe_ttm.ew": 21.940524482101246,
      "pe_ttm.ewpvo": 17.698597523399144,
      "pb.mcw": 1.484985393822744,
      "pb.ew": 1.4332208526319397,
      "pb.ewpvo": 1.4302235236340082,
      "mc": 10639657240324.55,
      "cmc": 9388589915425,
      "fb": 274139555821,
      "sb": 4897281943.249999,
      "stockCode": "000905"
    },
    {
      "date": dayjs().format('YYYY/MM/DD'), 
      "cp": 4699.28,
      "r_cp": 5720.56,
      "pe_ttm.mcw": 20.11136649001735,
      "pe_ttm.ew": 21.940524482101246,
      "pe_ttm.ewpvo": 17.698597523399144,
      "pb.mcw": 1.484985393822744,
      "pb.ew": 1.4332208526319397,
      "pb.ewpvo": 1.4302235236340082,
      "mc": 10639657240324.55,
      "cmc": 9388589915425,
      "fb": 274139555821,
      "sb": 4897281943.249999,
      "stockCode": "000905"
    }
  ]
  const filteredChartData = chartData ? chartData.filter((data) => new Date(data.date) > new Date(startDate)) : fakeData; 
  dataRef.current = filteredChartData;
  dataSourceRef.current = dataSource;

  const config = getChartConfig(filteredChartData, dataRef, handleAdd);

  return (
    <div className="min-h-screen mx-auto max-w-xl md:max-w-3xl">
      <FloatButton icon={<QuestionCircleOutlined />} type="primary" style={{ insetInlineEnd: 24 }} onClick={startTheMagicShow} />
      <Divider style={{  borderColor: '#7cb305' }}>参考文章</Divider>
      <AuthorTitleLink
        author="ETF拯救世界"
        title="估值对于投资同一个指数，到底有多大的作用？"
        href="https://weibo.com/p/1001603901079514384913"
        summary={[
"这篇文章通过分析中证500指数过去十年的市盈率（PE）数据，探讨了估值对长期投资收益的影响。文章指出，尽管过去十年中证500的年化收益率高达23%，但这种高收益并非普遍现象，而是起始于一个极度低估的时期。作者认为，估值是决定长期收益的关键因素。",
"文章通过选取中证500历史上PE最高和最低的月份，以及一个平均PE的月份，对比了从这些不同估值水平买入后的收益率。结果显示，低估值买入可以带来至少20%以上的年化收益率，甚至在某些情况下高达35%。相反，高估值买入的长期收益可能不如债券。",
"作者强调，耐心等待低估时机买入，而不是在高估时急于抢反弹，是实现长期稳定收益的策略。文章最后提到，当前中证500的PE为45，比十年平均PE高出17%，认为这不是一个理想的买入时机，建议投资者继续等待更合理的价格。",
"总结来说，文章的核心观点是：估值对长期投资收益有重大影响，投资者应耐心等待低估值时机，以实现更高的年化收益率。"
        ]}
        />
      <Divider style={{  borderColor: '#7cb305' }}>输入数据</Divider>
      <FileUploader onFileLoad={handleFileLoad} />
      <Divider style={{  borderColor: '#7cb305' }}>输出图表和表格</Divider>
      <DualAxes {...config} />
      <ChartControls
        timeFrame={timeFrame}
        onTimeFrameChange={handleTimeFrameChange}
        onDateRangeChange={handleDateRangeChange}
      />
      <Space size="middle">
        <SelectModal
          name="Add transactions"
          data={data ? data.days : null}
          onOk={handleAdd}
        />
        <PageToImageExporter />
      </Space>
      <AdvancedLocalStorageUI dataSource={dataSource} setDataSource={setDataSource} />
    </div>
  );
};

export default DualAxisChart;
