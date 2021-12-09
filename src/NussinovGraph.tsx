import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

function chart() {
  // create the svg area
  const svg = d3.create('svg')
    .attr('width', 500)
    .attr('height', 500)
    .append('g')
    .attr('transform', 'translate(220,220)');

  // create a matrix
  const matrix = [
    [11, 58, 89, 28],
    [51, 18, 20, 61],
    [80, 145, 80, 85],
    [103, 99, 40, 71],
  ];

  // Returns an array of tick angles and values for a given group and step.
  function groupTicks(d: any, step: any) {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map((value) => ({ value, angle: value * k + d.startAngle }));
  }

  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)(matrix);

  // Add the links between groups
  svg
    .datum(res)
    .append('g')
    .selectAll('path')
    .data((d) => d)
    .enter()
    .append('path')
    .attr('d', (d3.ribbon()
      .radius(190)) as any)
    .style('fill', '#69b3a2')
    .style('stroke', 'black');

  // this group object use each group of the data.groups object
  const group = svg
    .datum(res)
    .append('g')
    .selectAll('g')
    .data((d) => d.groups)
    .enter();

  // add the group arcs on the outer part of the circle
  group.append('g')
    .append('path')
    .style('fill', 'grey')
    .style('stroke', 'black')
    .attr('d', d3.arc()
      .innerRadius(190)
      .outerRadius(200) as any);

  // Add the ticks
  group
    .selectAll('.group-tick')
    .data((d) => groupTicks(d, 25)) // Controls the number of ticks: one tick each 25 here.
    .enter()
    .append('g')
    .attr('transform', (d) => `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${200},0)`)
    .append('line') // By default, x1 = y1 = y2 = 0, so no need to specify it.
    .attr('x2', 6)
    .attr('stroke', 'black');

  // Add the labels of a few ticks:
  group
    .selectAll('.group-tick-label')
    .data((d) => groupTicks(d, 25))
    .enter()
    .filter((d) => d.value % 25 === 0)
    .append('g')
    .attr('transform', (d) => `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${200},0)`)
    .append('text')
    .attr('x', 8)
    .attr('dy', '.35em')
    .attr('transform', (d) => (d.angle > Math.PI ? 'rotate(180) translate(-16)' : null))
    .style('text-anchor', (d) => (d.angle > Math.PI ? 'end' : null))
    .text((d) => 'GATC'[d.value % 4])
    .style('font-size', 9);
  console.log(svg); // eslint-disable-line
  return svg.node();
}

const NussinovGraph = function NussinovGraph(): JSX.Element {
  const myChart = chart();
  if (myChart === null) {
    throw new Error('Chart is null');
  }
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svg.current) {
      svg.current.appendChild(myChart);
    }
  }, []);

  return (
    <svg width="855" height="855" ref={svg} />
  );
};

export default NussinovGraph;
