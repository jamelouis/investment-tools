import { useState, useEffect } from 'react';
import { formatDate, groupByMonth, groupByYear } from '../../lib/utils';

export const useChartData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("./000300.json");
      
      const jsonObject = await response.json();
      processData(jsonObject.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (rawData) => {
    let temp = rawData.map((item) => ({
      date: formatDate(item.date),
      value: item.cp,
      pe: item.pe_ttm.mcw,
      pb: item.pb.mcw,
    }));
    temp.sort((a, b) => new Date(b.date) - new Date(a.date));

    setData({
      months: groupByMonth(temp),
      years: groupByYear(temp),
      days: temp.reverse(),
    });
  };

  return { data, isLoading };
};
