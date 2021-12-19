import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { INussinovPlotProps } from './NussinovPlot';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function drawForceGraph(
  { nodes, links }: any,
  {
    width = 800,
    height = 600,
    windowBuffer = 30,
    linkColor = '#999',
    linkOpacity = 0.6,
    nodeRadiusPixels = 5,
    nodeColor = '#999',
  }: any = { },
) {
  function intern(value: any) {
    return value !== null && typeof value === 'object' ? value.valueOf() : value;
  }

  const N = d3.map(nodes, (d: any) => d.id).map(intern);
  const LS = d3.map(links, ({ source }: any) => source).map(intern);
  const LT = d3.map(links, ({ target }: any) => target).map(intern);

  nodes = d3.map(nodes, (_, i) => ({ id: N[i] })); // eslint-disable-line
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] })); // eslint-disable-line

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({ index: i }: any) => N[i]);

  forceNode.strength(-5);

  forceLink.strength((link: any): number => {
    if (link.target.index - link.source.index === 1) {
      return 0.5;
    }
    return 0.8;
  });

  forceLink.distance((link: any): number => {
    if (link.target.index - link.source.index === 1) {
      return 8;
    }
    return 30;
  });

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  const simulation = d3.forceSimulation(nodes)
    .force('link', forceLink)
    .force('charge', forceNode)
    .force('center', d3.forceCenter())
    .on('tick', () => {
      link // eslint-disable-line
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node // eslint-disable-line
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      circles // eslint-disable-line
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      bpText // eslint-disable-line
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);

      if (nodes.length > 0) {
        let window = [nodes[0].x, nodes[0].y, nodes[0].x, nodes[0].y];
        for (let i = 1; i < nodes.length; i += 1) {
          window = [Math.min(window[0], nodes[i].x), Math.min(window[1], nodes[i].y),
            Math.max(window[2], nodes[i].x), Math.max(window[3], nodes[i].y)];
        }

        svg
          .attr('viewBox', [window[0] - windowBuffer,
            window[1] - windowBuffer,
            window[2] - window[0] + 2 * windowBuffer,
            window[3] - window[1] + 2 * windowBuffer]);
      }
    });

  const link = svg.append('g')
    .attr('stroke', linkColor)
    .attr('stroke-opacity', linkOpacity)
    .selectAll('line')
    .data(links)
    .join('line');

  const node = svg.selectAll('circle')
    .attr('stroke', nodeColor)
    .data(nodes)
    .enter()
    .append('g');

  const circles = node.append('circle')
    .attr('r', nodeRadiusPixels)
    .call(drag(simulation)); // eslint-disable-line

  const bpText = node.append('text')
    .style('fill', 'orange') // fill the text with the colour black
    .text('Hello World'); // define the text to display

  function drag(sim: any): any {
  /* eslint-disable no-param-reassign */
    function dragstarted(event: any) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) sim.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // link.attr('stroke-width', linkStrokeWidth);

  return Object.assign(svg.node(), { });
}

interface Link {
  readonly source: number;
  readonly target: number;
  readonly value: number;
}

interface Node {
  readonly id: number;
}

const ForceGraph = function ForceGraph(props: INussinovPlotProps): JSX.Element {
  const { bases, pairs } = props;
  const n = bases.length;

  const nodes: Node[] = [];
  const links: Link[] = [];
  let i = 0;
  for (; i < n; i += 1) {
    if (i < n - 1) links.push({ source: i, target: i + 1, value: 1 });
    nodes.push({ id: i });
  }

  for (i = 0; i < pairs.length; i += 1) {
    const l: Link = { source: +pairs[i][0], target: +pairs[i][1], value: 1 };
    if (l.source < n && l.target < n) {
      links.push(l);
    }
  }

  const forceGraph = {
    nodes,
    links,
  };

  const drawnGraph = drawForceGraph(forceGraph);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svg.current) {
      svg.current.appendChild(drawnGraph);
    }
  }, []);

  return (
    <svg width="1200" height="1200" ref={svg} />
  );
};

export default ForceGraph;
