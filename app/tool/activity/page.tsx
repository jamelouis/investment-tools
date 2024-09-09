"use client";

// Stack bar chart for activity count per year using D3.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import LineChartWithBrush from '@/app/components/LineChart';
import SunburstChart from '@/app/components/SunburstChart';
import assetData from '@/data/assets.json';
import FullScreenWrapper from '@/app/components/FullScreenWrapper';

const useCSVData = (url, row) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                d3.csv(url, row).then(data => setData(data));
            } catch (err) {
                setError('Failed to fetch or parse CSV data');
            }
        };

        fetchData();
    }, [url]);

    return { data, error };
};

const analyzeYear = (data) => {
    const yearlyData = d3.rollup(
        data,
        v => d3.sum(v, d => parseInt(d.tradeUnit)),
        d => d.date.getFullYear(),
        d => d.type
    );

    const result = Array.from(yearlyData, ([date, types]) =>
        Array.from(types, ([type, count]) => ({ date, type, count }))
    ).flat();
    result.sort((a, b) => d3.ascending(a.date, b.date));

    return result;
}

const analyzeMonth = (data) => {
    const monthlyData = d3.rollup(
        data,
        v => d3.sum(v, d => parseInt(d.tradeUnit)),
        d => d3.timeFormat('%Y-%m')(d3.timeMonth(d.date)),
        d => d.type
    );

    const result = Array.from(monthlyData, ([date, types]) =>
        Array.from(types, ([type, count]) => ({ date, type, count }))
    ).flat();

    return result;
}

const fillMissingMonthlyData = (data) => {
    const allDates = Array.from(new Set(data.map(d => d.date)));
    const allTypes = Array.from(new Set(data.map(d => d.type)));

    const startDate = d3.min(allDates, d => new Date(d));
    const endDate = d3.max(allDates, d => new Date(d));

    const allYearMonths = d3.timeMonths(
        d3.timeMonth.floor(startDate),
        d3.timeMonth.ceil(endDate)
    ).map(d => d3.timeFormat('%Y-%m')(d));

    const fullData = allYearMonths.flatMap(date =>
        allTypes.map(type => ({ date, type }))
    );

    const filledData = fullData.map(item => {
        const existingData = data.find(d => d.date === item.date && d.type === item.type);
        return existingData ? existingData : { ...item, count: 0 };
    });

    return filledData;
};

const processMonthlyData = (data) => {
    const monthlyData = analyzeMonth(data);
    return fillMissingMonthlyData(monthlyData);
};

const StackedBarChart = ({ data, enableBrush = false, onBrushed = null, onClick = null }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();
            const width = 928;
            const height = 500;
            const marginTop = 10;
            const marginRight = 10;
            const marginBottom = 60;
            const marginLeft = 40;

            svg.attr("viewBox", [0, 0, width, height])
                .attr("style", "max-height: 100%; width: auto;");

            const series = d3.stack()
                .keys(d3.union(data.map(d => d.type)))
                .value(([, D], key) => {
                    const v = D.get(key) ? D.get(key).count : 0;
                    return v;
                })
                (d3.index(data, d => d.date, d => d.type));

            const x = d3.scaleBand()
                .domain(data.map(d => d.date))
                .range([marginLeft, width - marginRight])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
                .rangeRound([height - marginBottom, marginTop]);

            svg.append("g")
                .selectAll()
                .data(series)
                .join("g")
                .attr("fill", d => d.key === 'buy' ? 'red' : 'green')
                .selectAll("rect")
                .data(D => D.map(d => (d.key = D.key, d)))
                .join("rect")
                .attr("x", d => x(d.data[0]))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width", x.bandwidth())
                .on('click', (event, d) => {
                    if(onClick) {
                        onClick(d.data[0]);
                    }
                })
                .append("title")
                .text(d => {
                    const v = d.data[1].get(d.key) ? d.data[1].get(d.key).count : 0;
                    return `${d.data[0]} ${d.key} ${v}`;
                });

            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 3))))
                .call(g => g.selectAll(".domain").remove())
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", -10)
                .attr("dy", ".35em")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(null, "s"))
                .call(g => g.selectAll(".domain").remove());

            if (enableBrush) {
                const brush = d3.brushX()
                    .extent([[marginLeft, 0.5], [width - marginRight, height - marginBottom + 0.5]])
                    .on("end", ({ selection }) => {
                        const selectedDate = selection.map(xx => x.domain()[Math.max(0, Math.min(x.domain().length - 1, Math.floor(xx / x.step() - 0.5)))]);
                        if (onBrushed) onBrushed([selectedDate[0] - 1, selectedDate[1]]);
                    });
                svg.append("g").call(brush);
            }
        }
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

const getDataPoints = (activityData, indexData) => {
    return activityData.map(a => {
        const dataPoint = indexData.find(d => d.date.getTime() === a.date.getTime());
        return dataPoint ? { date: dataPoint.date, value: dataPoint.value, url: a.articleLink } : null;
    }).filter(point => point !== null);
};

const IndexVisualization = ({ activityData, onMarkClicked, range }) => {
    const url = "https://gist.githubusercontent.com/jamelouis/64cd7580e042da48d4f95836784951de/raw/1b86392e112a783cb901fcb9af4a8ae13ad08e10/399001.csv";
    const row = (d) => {
        d.date = new Date(d.date);
        d.value = +d.close;
        return d;
    }
    const { data, error } = useCSVData(url, row);
    if (error) return <p className="text-red-500">{error}</p>
    if (!data) return <p className="text-gray-500">Loading...</p>

    const mark = getDataPoints(activityData, data);

    return <LineChartWithBrush data={data} mark={mark} onMarkClicked={onMarkClicked} range={range} />;
}

const SunburstChartDemo = () => {
    return (
      <div className="App">
        <SunburstChart data={assetData} width={600} />
      </div>
    );
}

export default function Activity() {
    const url = "https://gist.githubusercontent.com/jamelouis/c4d5d513b9f6c3c4ff59675409ea209a/raw/0b13854c513a96e9403c540b5fa9ec4bf07af5be/etf150_transactions.csv";
    const row = (d) => {
        d.date = new Date(d.date);
        d.tradeUnit = +d.tradeUnit;
        return d;
    };
    const { data, error } = useCSVData(url, row);
    const [filterYear, setFilterYear] = useState(null);
    const [articleLink, setArticleLink] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [filterData, setFilterData] = useState([]);

    const currentYear = new Date().getFullYear();
    const now = new Date();
    const [Range, setRange] = useState([new Date(currentYear, 0, 1), now]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!data) return <p className="text-gray-500">Loading...</p>;

    const filteredData = filterData.length === 0 ? data : data.filter(item => filterData.includes(item.fundCode));
    const yearData = analyzeYear(filteredData);
    const monthlyData = processMonthlyData(filteredData);

    const filterMonthlyData = filterYear ? monthlyData.filter(md => new Date(md.date) > new Date(filterYear[0], 11, 31) && new Date(md.date) <= new Date(filterYear[1], 11, 31)) : monthlyData;

    return (
        <>
            <div className='flex flex-col max-w-7xl m-auto min-h-screen'>
                <h2 className='text-center font-bold text-2xl pt-6 pb-3'>ETF150 发车</h2>
                <div className='flex flex-col md:flex-row w-full'>
                    <FullScreenWrapper className='flex-1 p-4'>
                        <div className='max-w-4xl m-auto'>
                            <h3 className='text-center text-sm'>资产配置图</h3>
                            <SunburstChartDemo />
                        </div>
                    </FullScreenWrapper>
                    <div className='flex-1 p-4'>
                        <FullScreenWrapper>
                            <h3 className='text-center text-sm'>年度直方图</h3>
                        <StackedBarChart data={yearData} enableBrush={true} onBrushed={(d) => setFilterYear(d)} />
                        </FullScreenWrapper>
                        <FullScreenWrapper>
                            <h3 className='text-center text-sm'>月度直方图</h3>
                        <StackedBarChart data={filterMonthlyData} onClick={(date) => {
                            const dateString = date.split('-');
                            const year = parseInt(dateString[0]);
                            const month = parseInt(dateString[1]) - 1; // JavaScript months are 0-indexed
                            const startDate = new Date(year, month, 1);
                            const endDate = new Date(year, month + 1, 1);
                            setRange([startDate, endDate]);
                        }} />
                        </FullScreenWrapper>
                    </div>
                </div>
                <FullScreenWrapper className='flex-1 p-4'>
                    <h3 className='text-center text-sm'>深综指与发车记录</h3>
                    <IndexVisualization activityData={filteredData} onMarkClicked={setArticleLink} range={Range} />
                </FullScreenWrapper>
            </div>
        </>
    );
}


