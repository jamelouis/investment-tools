import { useState, useCallback } from 'react';
import { formatDate, groupByMonth, groupByYear } from '../../lib/utils';

export const useChartDataFromFile = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFile = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result as string;
        if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          processData(file.name, jsonData.data || jsonData);
        } else if (file.name.endsWith('.csv')) {
        } else {
          throw new Error('Unsupported file type. Please use JSON or CSV.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, []);

  const processData = (filename, rawData) => {
    let temp = rawData.map((item) => ({
      date: formatDate(item.date),
      value: parseFloat(item.cp || item.value),
      pe: parseFloat(item["pe_ttm.mcw"] || item.pe),
      pb: parseFloat(item["pb.mcw"] || item.pb),
    }));
    temp.sort((a, b) => new Date(b.date) - new Date(a.date));

    setData({
      name: filename,
      months: groupByMonth(temp),
      years: groupByYear(temp),
      days: temp.reverse(),
    });
  };

  return { data, isLoading, error, loadFile };
};