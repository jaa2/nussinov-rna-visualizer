import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { INussinovPlotProps } from './NussinovPlot';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function drawForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links, // an iterable of link objects (typically [{source, target}, …])
}: any, {
  nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeFill = 'currentColor', // node stroke fill (if not using a group color encoding)
  nodeStroke = '#fff', // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 5, // node radius, in pixels
  nodeStrength,
  linkSource = ({ source }: any) => source, // given d in links, returns a node identifier string
  linkTarget = ({ target }: any) => target, // given d in links, returns a node identifier string
  linkStroke = '#999', // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = 'round', // link stroke linecap
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  width = 800, // outer width, in pixels
  height = 600, // outer height, in pixels
  invalidation, // when this promise resolves, stop the simulation
}: any = {}) {
  // Compute values.
  function intern(value: any) {
    return value !== null && typeof value === 'object' ? value.valueOf() : value;
  }

  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  // const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  // const W = typeof linkStrokeWidth !== 'function' ? null : d3.map(links, linkStrokeWidth);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({ id: N[i] })); // eslint-disable-line
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] })); // eslint-disable-line

  // Compute default domains.
  // if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({ index: i }: any) => N[i]);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);

  forceNode.strength((node: any): number => {
    if (node.index >= 9 && node.index <= 11) {
      return -5;
    }
    return -5;
  });

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

      if (nodes.length > 0) {
        let window = [nodes[0].x, nodes[0].y, nodes[0].x, nodes[0].y];
        for (let i = 1; i < nodes.length; i += 1) {
          window = [Math.min(window[0], nodes[i].x), Math.min(window[1], nodes[i].y),
            Math.max(window[2], nodes[i].x), Math.max(window[3], nodes[i].y)];
        }

        const buffer = 30;

        svg
          .attr('viewBox', [window[0] - buffer,
            window[1] - buffer,
            window[2] - window[0] + 2 * buffer,
            window[3] - window[1] + 2 * buffer]);
      }
    });

  const link = svg.append('g')
    .attr('stroke', linkStroke)
    .attr('stroke-opacity', linkStrokeOpacity)
    .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
    .attr('stroke-linecap', linkStrokeLinecap)
    .selectAll('line')
    .data(links)
    .join('line');

  const node = svg.append('g')
    .attr('fill', nodeFill)
    .attr('stroke', nodeStroke)
    .attr('stroke-opacity', nodeStrokeOpacity)
    .attr('stroke-width', nodeStrokeWidth)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', nodeRadius)
    .call(drag(simulation)); // eslint-disable-line

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

  // if (W) link.attr('stroke-width', ({index: i}) => W[i]);
  // if (G) node.attr('fill', ({index: i}) => color(G[i]));
  // if (T) node.append('title').text(({index: i}) => T[i]);
  link.attr('stroke-width', linkStrokeWidth);

  if (invalidation != null) invalidation.then(() => simulation.stop());

  return Object.assign(svg.node(), { scales: { color } });
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
