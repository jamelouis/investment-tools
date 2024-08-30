import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function createMarketTrendChart(svg, config) {
    const {
        up,
        flat,
        down,
        marginLeft = 100,
        marginTop = 20,
        width = 1000,
        height = 40,
        upColor = '#F44336',
        flatColor = '#5f5f5f',
        downColor = '#4CAF50',
        fontSize = '20px',
        upText = '涨',
        downText = '跌',
        showText = true
    } = config;

    const total = up + flat + down;
    const up_ = Math.floor(up / total * width);
    const flat_ = Math.floor(flat / total * width);
    const down_ = Math.floor(down / total * width);

    const g = svg.append("g")
        .attr("transform", `translate(${marginLeft},${marginTop})`);

    // Down path
    g.append("path")
        .attr("d", `M0 0 a 10 10, 0, 0, 0, 0 ${height} h ${down_ - 5} l 10 -${height} z`)
        .attr("fill", downColor)
        .attr("stroke", "none");

    // Flat path
    g.append("path")
        .attr("d", `M ${down_} ${height} h ${flat_ - 5} l 10 -${height} h ${-flat_ + 5} z`)
        .attr("fill", flatColor)
        .attr("stroke", "none");

    // Up path
    g.append("path")
        .attr("d", `M ${down_ + flat_} ${height} h ${up_} a 10 10, 0, 0, 0, 0 -${height} h ${-up_ + 10} z`)
        .attr("fill", upColor)
        .attr("stroke", "none");

    if (showText) {
        // Down text
        g.append("text")
            .attr('x', 0)
            .attr('y', height + 32)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .attr('fill', downColor)
            .style('font-size', fontSize)
            .text(`${downText} ${down}`);

        // Up text
        g.append("text")
            .attr('x', width)
            .attr('y', height + 32)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('fill', upColor)
            .style('font-size', fontSize)
            .text(`${up} ${upText}`);
    }

    return g; // Return the group element for further customization if needed
}

const MarketSentimentChart = ({ up, flat, down} :  { up: number, flat: number, down: number}) => {
    const svgRef = useRef();

    const width = 1200;
    const height = 120;

    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', "max-width: 100%; height: auto;");

    createMarketTrendChart(svg, {
        up,
        flat,
        down,
        upText: '涨',
        downText: '跌',
        fontSize: "32px"
    });

    return <svg ref={svgRef}></svg>;
};

export default MarketSentimentChart;