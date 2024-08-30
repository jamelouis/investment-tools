"use client";

// Stack bar chart for activity count per year using D3.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import LineChartWithBrush from '@/app/components/LineChart';

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
    // Group the data by year and type, then sum the tradeUnits
    const yearlyData = d3.rollup(
        data,
        v => d3.sum(v, d => parseInt(d.tradeUnit)),
        d => d.date.getFullYear(),
        d => d.type
    );

    // Convert the nested Map to an array of objects
    const result = Array.from(yearlyData, ([date, types]) =>
        Array.from(types, ([type, count]) => ({ date, type, count }))
    ).flat();
    // Sort the result array by date
    result.sort((a, b) => d3.ascending(a.date, b.date));

    return result;
}

const analyzeMonth = (data) => {
    // Group the data by year, month, and type, then sum the tradeUnits
    const monthlyData = d3.rollup(
        data,
        v => d3.sum(v, d => parseInt(d.tradeUnit)),
        d => d3.timeFormat('%Y-%m')(d3.timeMonth(d.date)),
        d => d.type
    );

    // Convert the nested Map to an array of objects
    const result = Array.from(monthlyData, ([date, types]) =>
        Array.from(types, ([type, count]) => ({ date, type, count }))
    ).flat();

    return result;
}

const fillMissingMonthlyData = (data) => {
    // Get all unique dates and types
    const allDates = Array.from(new Set(data.map(d => d.date)));
    const allTypes = Array.from(new Set(data.map(d => d.type)));

    // Get the range of dates
    const startDate = d3.min(allDates, d => new Date(d));
    const endDate = d3.max(allDates, d => new Date(d));

    // Generate all year-months between start and end date
    const allYearMonths = d3.timeMonths(
        d3.timeMonth.floor(startDate),
        d3.timeMonth.ceil(endDate)
    ).map(d => d3.timeFormat('%Y-%m')(d));

    // Combine all year-months with all types
    const fullData = allYearMonths.flatMap(date =>
        allTypes.map(type => ({ date, type }))
    );

    // Merge fullData with existing data
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
            svg.selectAll("*").remove(); // Clear all child elements of the SVG
            const width = 928;
            const height = 500;
            const marginTop = 10;
            const marginRight = 10;
            const marginBottom = 60;
            const marginLeft = 40;

            // Create the SVG container.
            svg.attr("viewBox", [0, 0, width, height])
                .attr("style", "max-height: 100%; width: auto;");

            // Determine the series that need to be stacked.
            const series = d3.stack()
                .keys(d3.union(data.map(d => d.type))) // distinct series keys, in input order
                .value(([, D], key) => {
                    const v = D.get(key) ? D.get(key).count : 0;
                    return v;
                })  // get value for each series key and stack 
                (d3.index(data, d => d.date, d => d.type)); // group by stack then series key

            // Prepare the scales for positional and color encodings.
            const x = d3.scaleBand()
                .domain(data.map(d => d.date))
                .range([marginLeft, width - marginRight])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
                .rangeRound([height - marginBottom, marginTop]);

            // Append a group for each series, and a rect for each element in the series.
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
                    console.log(d.data[0]);
                    if(onClick)
                    {
                        onClick(d.data[0]);
                    }
                })
                .append("title")
                .text(d => {
                    const v = d.data[1].get(d.key) ? d.data[1].get(d.key).count : 0;
                    return `${d.data[0]} ${d.key} ${v}`
                }
                );

            // Append the horizontal axis.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).tickValues(x.domain().filter(function (d, i) { return !(i % 3) })))
                .call(g => g.selectAll(".domain").remove())
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", -10)
                .attr("dy", ".35em")
                .style("text-anchor", "end");

            // Append the vertical axis.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(null, "s"))
                .call(g => g.selectAll(".domain").remove());

            if (enableBrush) {

                const brush = d3.brushX()
                    .extent([[marginLeft, 0.5], [width - marginRight, height - marginBottom + 0.5]])
                    .on("end", ({ selection }) => {
                        console.log(selection);

                        const selectedDate = selection.map(xx => x.domain()[Math.max(0, Math.min(x.domain().length - 1, Math.floor(xx / x.step() - 0.5)))]);
                        console.log(selectedDate);
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
    if (error) return <p>{error}</p>
    if (!data) return <p>Loading...</p>

    const mark = getDataPoints(activityData, data);

    return <LineChartWithBrush data={data} mark={mark} onMarkClicked={onMarkClicked} range={range} />;
}

export default function Activity() {
    const url = "https://gist.githubusercontent.com/jamelouis/c4d5d513b9f6c3c4ff59675409ea209a/raw/0b13854c513a96e9403c540b5fa9ec4bf07af5be/etf150_transactions.csv";
    const row = (d) => {
        d.date = new Date(d.date);
        d.tradeUint = +d.tradeUnit;
        return d;
    };
    const { data, error } = useCSVData(url, row);
    const [filterYear, setFilterYear] = useState(null);
    const [articleLink, setArticleLink] = useState('https://qieman.com/alfa/portfolio/LONG_WIN/signal');
    const [isExpanded, setIsExpanded] = useState(true);
    
    const currentYear = new Date().getFullYear();
    const now = new Date();
    const [Range, setRange] = useState([new Date(currentYear, 0, 1), now]);

    if (error) return <p>{error}</p>
    if (!data) return <p>Loading...</p>

    const yearData = analyzeYear(data);
    const monthlyData = processMonthlyData(data);

    const filterMonthlyData = filterYear ? monthlyData.filter(md => new Date(md.date) > new Date(filterYear[0], 11, 31) && new Date(md.date) <= new Date(filterYear[1], 11, 31)) : monthlyData;

    return (
        <>
            <div className='flex justify-center mb-[480px] '>
                <div className='flex-col w-8/12 mb-12'>
                    <h2 className='text-5xl text-center p-6'>长赢计划发车可视化</h2>
                    <StackedBarChart data={yearData} enableBrush={true} onBrushed={(d) => setFilterYear(d)} />
                    <StackedBarChart data={filterMonthlyData} onClick={(date)=> {
                        const dateString = date.split('-');
                        const year = parseInt(dateString[0]);
                        const month = parseInt(dateString[1]) - 1; // JavaScript months are 0-indexed
                        const startDate = new Date(year, month, 1);
                        const endDate = new Date(year, month + 1, 1);
                        console.log(startDate, endDate);
                        setRange([startDate, endDate]);
                    }}/>
                </div>
            <div className="fixed bottom-0 w-8/12 mt-10 mr-12 ml-10 ring-1 ">
                <div className="bg-white shadow-lg rounded-lg">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full p-2 text-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'} 
                    </button>
                    {isExpanded && (
                        <div className="p-6">
                            <IndexVisualization activityData={data} onMarkClicked={setArticleLink} range={Range} />
                        </div>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};


