import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import { getOffsetAngle } from './NussinovPlot';

interface Link {
  readonly source: number;
  readonly target: number;
  readonly value: number;
  readonly nussinovPair: boolean;
  readonly inBulge: boolean;
  readonly bpLink: boolean;
}

interface Node {
  readonly id: number;
  readonly bpText: string;
  readonly isBp: boolean;
  readonly inBulge: boolean;
}

export interface IForceGraphProps {
  bases: string,
  pairs: [number, number][]
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function drawForceGraph(
  { nodes, links }: any,
  {
    width = 700,
    height = 500,
    windowBuffer = 10,
    windowBounds = 800,
    ticksPerRender = 4,
    linkColor = '#555',
    linkOpacity = 0.7,
    startStopLinkOpacity = 0.2,
    nodeRadiusPixels = 5,
    startStopRadiusPixels = 7,
    nodeColor = '#333',
    nodeFontSizeEm = '0.4em',
    startStopNodeColor = '#888',
    bulgeColor = '#252073',
  }: any = { },
) {
  function intern(value: any) {
    return value !== null && typeof value === 'object' ? value.valueOf() : value;
  }

  const N = d3.map(nodes, (d: any) => d.id).map(intern);
  const LS = d3.map(links, ({ source }: any) => source).map(intern);
  const LT = d3.map(links, ({ target }: any) => target).map(intern);

  nodes = d3.map(nodes, (_, i) => ({ // eslint-disable-line
    id: N[i],
    bpText: nodes[i].bpText,
    isBp: nodes[i].isBp,
    inBulge: nodes[i].inBulge,
  }));
  links = d3.map(links, (_, i) => ({ // eslint-disable-line
    source: LS[i],
    target: LT[i],
    nussinovPair: links[i].nussinovPair,
    inBulge: links[i].inBulge,
    bpLink: links[i].bpLink,
  }));

  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({ index: i }: any) => N[i]);

  forceNode.strength(-5);

  forceLink.strength((link: any): number => {
    if (link.nussinovPair) {
      return 0.5;
    }
    return 0.8;
  });

  forceLink.distance((link: any): number => {
    if (link.nussinovPair) {
      return 25;
    }
    return link.inBulge ? 15 : 8;
  });

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  let firstTick = true;

  const simulation = d3.forceSimulation(nodes)
    .force('link', forceLink)
    .force('charge', forceNode)
    .force('center', d3.forceCenter())
    .on('tick', () => {
      /* eslint-disable no-param-reassign */
      if (firstTick) {
        let theta = getOffsetAngle(nodes.length);
        const tau = 2 * Math.PI;
        const radius = nodes.length;
        for (let i = 0; i < nodes.length; i += 1) {
          nodes[i].x = radius * Math.cos(theta);
          nodes[i].y = radius * Math.sin(theta);
          theta += tau / nodes.length;
        }
      }

      firstTick = false;
      for (let i = 0; i < ticksPerRender; i += 1) {
        simulation.tick();
      }

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
          window = [
            Math.min(nodes[i].x, window[0]),
            Math.min(nodes[i].y, window[1]),
            Math.max(nodes[i].x, window[2]),
            Math.max(nodes[i].y, window[3])];
        }

        svg
          .attr('viewBox', [
            clamp(window[0] - windowBuffer, -windowBounds, windowBounds),
            clamp(window[1] - windowBuffer, -windowBounds, windowBounds),
            clamp(window[2] - window[0] + 2 * windowBuffer, -windowBounds, windowBounds),
            clamp(window[3] - window[1] + 2 * windowBuffer, -windowBounds, windowBounds),
          ]);
      }
    });

  const link = svg.append('g')
    .attr('stroke', linkColor)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-opacity', (l: any): string => (l.bpLink ? linkOpacity : startStopLinkOpacity))
    .attr('stroke-dasharray', (l: any): string => (l.nussinovPair ? '1' : ''));

  const node = svg.selectAll('circle')
    .attr('stroke', nodeColor)
    .data(nodes)
    .enter()
    .append('g');

  const circles = node.append('circle')
    .attr('r', (n: any): string => (n.isBp ? nodeRadiusPixels : startStopRadiusPixels))
    .attr('fill', (n: any): string => {
      if (n.isBp) {
        return n.inBulge ? bulgeColor : nodeColor;
      }
      return startStopNodeColor;
    })
    .call(drag(simulation)); // eslint-disable-line

  const bpText = node.append('text')
    .style('fill', 'white')
    .style('font-size', (n: any): string => (n.isBp ? nodeFontSizeEm : '0.3em'))
    .attr('text-anchor', 'middle')
    .attr('dy', nodeFontSizeEm)
    .attr('pointer-events', 'none')
    .text((n: any): string => n.bpText);

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

  return Object.assign(svg.node(), { });
}

const ForceGraph = function ForceGraph(props: IForceGraphProps): JSX.Element {
  const { bases, pairs } = props;
  const n = bases.length;

  const nodes: Node[] = [];
  const links: Link[] = [];
  const pairedNodes: Set<number> = new Set<number>();
  let i = 0;

  for (; i < pairs.length; i += 1) {
    const l: Link = {
      source: +pairs[i][0],
      target: +pairs[i][1],
      value: 1,
      nussinovPair: true,
      inBulge: false,
      bpLink: true,
    };
    if (l.source < n && l.target < n) {
      links.push(l);
    }
    pairedNodes.add(l.source);
    pairedNodes.add(l.target);
  }

  for (i = 0; i < n; i += 1) {
    if (i < n - 1) {
      links.push({
        source: i,
        target: i + 1,
        value: 1,
        nussinovPair: false,
        inBulge: !pairedNodes.has(i) || !pairedNodes.has(i + 1),
        bpLink: true,
      });
    }
    nodes.push({
      id: i, bpText: bases.charAt(i), isBp: true, inBulge: pairedNodes.has(i),
    });
  }

  // Add start/stop indicators
  if (n > 0) {
    nodes.push({
      id: -1, bpText: 'start', isBp: false, inBulge: false,
    });
    nodes.push({
      id: n, bpText: 'end', isBp: false, inBulge: false,
    });
    links.push({
      source: -1, target: 0, value: 1, nussinovPair: false, inBulge: true, bpLink: false,
    });
    links.push({
      source: n - 1, target: n, value: 1, nussinovPair: false, inBulge: true, bpLink: false,
    });
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
    <svg width="700" height="500" ref={svg} />
  );
};

export default ForceGraph;
