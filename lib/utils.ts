export const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const groupByMonth = (arr) => {
  let monthGroup = arr.reduce((groups, item) => {
    const date = new Date(item.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
    return groups;
  }, {});

  return Object.values(monthGroup).map((group) => group[0]).reverse();
};

export const groupByYear = (arr) => {
  let yearGroup = arr.reduce((groups, item) => {
    const year = new Date(item.date).getFullYear();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
    return groups;
  }, {});

  return Object.values(yearGroup).map((group) => group[0]).reverse();
};

export const calcGains = (date_at_buy, value_at_buy, date_at_sell, value_at_sell) => {
  const totalGain = (value_at_sell - value_at_buy) / value_at_buy;
  const yearsDiff = (date_at_sell.getTime() - date_at_buy.getTime()) / (1000 * 3600 * 24 * 365.25);
  const annualizedReturn = Math.pow(value_at_sell / value_at_buy, 1 / yearsDiff) - 1;
  return { totalGain, annualizedReturn };
};
