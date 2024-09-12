import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataItem {
  name: string;
  value: number;
  children?: DataItem[];
  code?: string;
}

interface SunburstChartProps {
  data: DataItem;
  onClick?: (data: { name: string; codes?: string[] }) => void;
}

interface ArcDatum extends d3.HierarchyRectangularNode<DataItem> {
  current: d3.HierarchyRectangularNode<DataItem>;
  target?: d3.HierarchyRectangularNode<DataItem>;
}

const SunburstChart: React.FC<SunburstChartProps> = ({
  data,
  onClick = null,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = 928;

    const height = width;
    const radius = width / 6;
    // Create SVG
    svg
      .attr("viewBox", [-width / 2, -height / 2, width, width])
      .style("font", "10px sans-serif")
      .attr("style", "max-height: 100%; width: auto;");

    // Color scale
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children?.length ?? 1 + 1),
    );

    // Compute the layout
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    const root = d3
      .partition<DataItem>()
      .size([2 * Math.PI, hierarchy.height + 1])(hierarchy) as ArcDatum;
    root.each((d) => (d.current = d));

    // Arc generator
    const arc = d3
      .arc<ArcDatum>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    // Clear previous content
    svg.selectAll("*").remove();

    // Append the arcs
    const path = svg
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0,
      )
      .attr("pointer-events", (d) => (arcVisible(d.current) ? "auto" : "none"))
      .attr("d", (d) => arc(d.current));

    path.style("cursor", "pointer").on("click", clicked);
    // Make them clickable if they have children
    /*
    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.filter(d => !d.children)
      .style("cursor", "pointer")
      .on("click", (event, p) => {
        const data = {
          "name": p.data.name,
          "codes": [p.data.code]
        };
        onClick(data);
        console.log(data);
      })
    */

    const format = d3.format(",d");
    path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value ?? 0)}`,
    );

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d) => +labelVisible(d.current))
      .attr("transform", (d) => labelTransform(d.current))
      .text((d) => d.data.name);

    const parent = svg
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    let title = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(root.data.name);

    function clicked(event: MouseEvent, p: ArcDatum) {
      parent.datum(p.parent || root);

      title.text(p.data.name);

      root.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          }),
      );

      const t = svg.transition().duration(750);

      path
        .transition(t)
        .tween("data", (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0,
        )
        .attr("pointer-events", (d) => (arcVisible(d.target) ? "auto" : "none"))
        .attrTween("d", (d) => () => arc(d.current));

      label
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", (d) => +labelVisible(d.target))
        .attrTween("transform", (d) => () => labelTransform(d.current));

      if (onClick) {
        if (p.children) {
          onClick(p.data);
        } else {
          onClick({
            name: p.data.name,
            codes: p.data.code ? [p.data.code] : undefined,
          });
        }
      }
    }

    function arcVisible(d: d3.HierarchyRectangularNode<DataItem>) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: d3.HierarchyRectangularNode<DataItem>) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: d3.HierarchyRectangularNode<DataItem>) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [data, onClick]);

  return <svg ref={svgRef} />;
};

export default SunburstChart;
