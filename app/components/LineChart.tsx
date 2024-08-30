import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChartWithBrush = ({data, mark, onMarkClicked, range}) => {
  const svgRef = useRef(null);
  const [brushExtent, setBrushExtent] = useState(range);

  useEffect(() => {
    if (range && range.length === 2) {
      setBrushExtent(range);
      console.log(range);
    }
  }, [range]);

  useEffect(() => {

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 110, left: 60 };
    const margin2 = { top: 230, right: 30, bottom: 30, left: 60 };
    const width = 1080 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const height2 = 300 - margin2.top - margin2.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

            svg.attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
                .attr("style", "max-width: 100%; height: auto;");

    // Set up scales
    const x = d3.scaleTime().range([0, width]);
    const x2 = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const y2 = d3.scaleLinear().range([height2, 0]);

    // Set domains
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.value)]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    // Create clip path
    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // Create focus area (main chart)
    const focus = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create context area (brush chart)
    const context = svg.append('g')
      .attr('transform', `translate(${margin2.left},${margin2.top})`);

    // Create line generators
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    const line2 = d3.line()
      .x(d => x2(d.date))
      .y(d => y2(d.value));

    // Add lines
    focus.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('clip-path', 'url(#clip)')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    context.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line2);

    // Add markers
    
    focus.selectAll('.dot')
      .data(mark)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('clip-path', 'url(#clip)')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 3.5)
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('border', '1px solid #ddd')
          .style('padding', '10px')
          .style('opacity', 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`📅: ${d3.timeFormat("%Y-%m-%d")(d.date)} <br/>数值: ${d.value} <br/> 点击查看发车文章`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        d3.select('.tooltip').remove();
      })
      .on('click', (event, d) => {
        if (d.url) {
          window.open(d.url, '_blank');
          //onMarkClicked(d.url);
        }
      });


    // Add axes
    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    focus.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height2})`)
      .call(d3.axisBottom(x2));

    // Add brush
    const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on('end', brushed);

    context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, brushExtent.map(d => x(d)));

    // Brush function
    function brushed(event) {
      if (event.sourceEvent && event.sourceEvent.type === 'zoom') return;
      const selection = event.selection || x2.range();
      x.domain(selection.map(x2.invert, x2));
      focus.select('.line').attr('d', line);
      focus.selectAll('.dot')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value));
      focus.select('.axis--x').call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));
    }

  }, [range]);

  return <svg ref={svgRef}></svg>;
};

export default LineChartWithBrush;