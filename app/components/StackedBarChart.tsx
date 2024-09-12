import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ data, enableBrush = false, onBrushed = null, onClick = null }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();
            const width = 928;
            const height = 500;
            const margin = { top: 10, right: 10, bottom: 60, left: 40 };

            svg.attr("viewBox", [0, 0, width, height])
                .attr("style", "max-height: 100%; width: auto;");

            const series = d3.stack()
                .keys(d3.union(data.map(d => d.type)))
                .value(([, D], key) => D.get(key) ? D.get(key).count : 0)
                (d3.index(data, d => d.date, d => d.type));

            const x = d3.scaleBand()
                .domain(data.map(d => d.date))
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
                .rangeRound([height - margin.bottom, margin.top]);

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
                .on('click', (event, d) => onClick && onClick(d.data[0]))
                .append("title")
                .text(d => {
                    const v = d.data[1].get(d.key) ? d.data[1].get(d.key).count : 0;
                    return `${d.data[0]} ${d.key} ${v}`;
                });

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 3))))
                .call(g => g.selectAll(".domain").remove())
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", -10)
                .attr("dy", ".35em")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(null, "s"))
                .call(g => g.selectAll(".domain").remove());

            if (enableBrush) {
                const brush = d3.brushX()
                    .extent([[margin.left, 0.5], [width - margin.right, height - margin.bottom + 0.5]])
                    .on("end", ({ selection }) => {
                        const selectedDate = selection.map(xx => x.domain()[Math.max(0, Math.min(x.domain().length - 1, Math.floor(xx / x.step() - 0.5)))]);
                        onBrushed && onBrushed([selectedDate[0] - 1, selectedDate[1]]);
                    });
                svg.append("g").call(brush);
            }
        }
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default StackedBarChart;