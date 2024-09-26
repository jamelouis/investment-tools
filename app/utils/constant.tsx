import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const base_path =
  process.env.NEXT_PUBLIC_BASE_PATH === undefined
    ? ""
    : process.env.NEXT_PUBLIC_BASE_PATH;

export const Asset_CSV_URL = base_path + "/csv/assets.csv";
export const Transaction_CSV_URL = base_path + "/csv/etf150-transactions.csv";

export const activity_references = [
  {
    title: "长赢指数投资计划-150份: 发车记录",
    url: "https://qieman.com/alfa/portfolio/LONG_WIN/signal",
    author: "且慢",
  },
  {
    title: "ETF计划Q&A（2017版）",
    url: "https://mp.weixin.qq.com/s/p4c7vb7i3Z0yPFvZkZc9CA",
    author: "长赢指数投资（微信）",
  },
  {
    title: "二级市场捡辣鸡冠军",
    url: "https://weibo.com/u/7519797263",
    author: "微博",
  },
  {
    title: "ETF拯救世界",
    url: "https://weibo.com/u/5687069307",
    author: "微博",
  },
  {
    title: "ETF拯救世界",
    url: "https://xueqiu.com/u/4776750571",
    author: "雪球",
  },
  {
    title: "E大干货合集",
    url: "https://youzhiyouxing.cn/topics/ezone/nodes/2",
    author: "有知有行",
  },
  {
    title: "使用文档",
    url: "https://jamelouis.notion.site/c9d3c209276b47d0a8d081ea66dcff81",
    author: "jamelouis",
  },
];

export const up_flat_down_references = [
  {
    title: "行情中心",
    url: "https://q.10jqka.com.cn/",
    author: "同花顺",
  },
  {
    title: "箱形图",
    url: "http://tuzhidian.com/chart?id=5c666f91372bb033b9c2fa75",
    author: "图之典",
  },
];
export const useCSVData = (url, row) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await d3.csv(url, row);
        setData(data);
      } catch (error) {
        setError(
          `Failed to fetch or parse CSV data from ${url}: ${error.message}`,
        );
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
};

export const analyzeData = (data, timeFormat, groupBy) => {
  const groupedData = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => parseInt(d.tradeUnit)),
    (d) => groupBy(d),
    (d) => d.type,
  );

  const result = Array.from(groupedData, ([date, types]) =>
    Array.from(types, ([type, count]) => ({ date, type, count })),
  ).flat();

  result.sort((a, b) => d3.ascending(a.date, b.date));
  return result;
};

export const fillMissingData = (data) => {
  const allDates = Array.from(new Set(data.map((d) => d.date)));
  const allTypes = Array.from(new Set(data.map((d) => d.type)));

  const startDate = d3.min(allDates, (d) => new Date(d));
  const endDate = d3.max(allDates, (d) => new Date(d));

  const allYearMonths = d3
    .timeMonths(d3.timeMonth.floor(startDate), d3.timeMonth.ceil(endDate))
    .map((d) => d3.timeFormat("%Y-%m")(d));

  const fullData = allYearMonths.flatMap((date) =>
    allTypes.map((type) => ({ date, type })),
  );

  return fullData.map((item) => {
    const existingData = data.find(
      (d) => d.date === item.date && d.type === item.type,
    );
    return existingData ? existingData : { ...item, count: 0 };
  });
};

export const processMonthlyData = (data) => {
  const monthlyData = analyzeData(data, d3.timeFormat("%Y-%m"), (d) =>
    d3.timeFormat("%Y-%m")(d3.timeMonth(d.date)),
  );
  return fillMissingData(monthlyData);
};

export const convertToSunburst = (data) => {
  const sunburstData = { name: "sunburst", children: [] };

  data.forEach((item) => {
    let currentLevel = sunburstData.children;
    let parent;

    for (let i = 0; i < item.groupN; i++) {
      let children = currentLevel.filter(
        (child) => child.name === item[`group${i}`],
      );

      if (children.length > 0) {
        parent = children[0];
      } else {
        let newChild = { name: item[`group${i}`], children: [] };

        if (parent) {
          parent.children = parent.children.concat(newChild);
        } else {
          currentLevel.push(newChild);
        }

        parent = newChild;
      }

      currentLevel = parent.children;

      if (i === item.groupN - 1) {
        parent.children.push({ name: item.name, code: item.code });
      }
    }
  });

  return sunburstData;
};

export function generateSunburstData(data) {
  const result = {
    name: "全部",
    codes: [],
    children: [],
  };

  // Helper function to find or create a child node
  function findOrCreateChild(parent, name) {
    let child = parent.children.find((c) => c.name === name);
    if (!child) {
      child = { name, codes: [], children: [] };
      parent.children.push(child);
    }
    return child;
  }

  // Process each item in the input data
  data.forEach((item) => {
    let currentNode = result;
    const groupKeys = Object.keys(item).filter((key) =>
      key.startsWith("group"),
    );
    groupKeys.sort(); // Ensure we process groups in order (group0, group1, group2, ...)

    // Traverse through all group levels
    for (const groupKey of groupKeys) {
      currentNode = findOrCreateChild(currentNode, item[groupKey]);
    }

    // Add the item to the deepest level
    currentNode.children.push({
      name: item.name,
      code: item.code,
      value: 1,
      underlying: item.underlying,
    });

    // Add the code to the codes arrays at all levels
    let node = result;
    if (!node.codes.includes(item.code)) {
      node.codes.push(item.code);
    }
    for (const groupKey of groupKeys) {
      node = node.children.find((c) => c.name === item[groupKey]);
      if (!node.codes.includes(item.code)) {
        node.codes.push(item.code);
      }
    }
  });

  return result;
}
