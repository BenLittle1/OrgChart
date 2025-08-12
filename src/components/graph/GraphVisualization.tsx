'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useData } from '@/context/DataContext';
import { convertToGraphData, getCompletionColor } from '@/lib/utils';
import { GraphNode, GraphLink } from '@/types';

export default function GraphVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data } = useData();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Create zoom behavior outside useEffect so it can be accessed by handlers
  const zoom = useRef(d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 4])
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerRect = svgRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Convert organizational data to graph format
    const graphData = convertToGraphData(data);
    const { nodes, links } = graphData;

    // Main container group
    const container = svg.append('g');

    // Configure zoom behavior
    zoom.current.on('zoom', (event) => {
      container.attr('transform', event.transform);
    });

    svg.call(zoom.current);

    // Create force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => Math.sqrt((d as GraphNode).weight) * 8 + 5));

    // Create links
    const link = container.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = container.append('g')
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => Math.sqrt(d.weight) * 8)
      .attr('fill', (d) => getCompletionColor(d.completionPercentage))
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Create labels
    const label = container.append('g')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('font-size', (d) => Math.max(10, Math.sqrt(d.weight) * 3))
      .attr('font-family', 'system-ui, sans-serif')
      .attr('fill', '#f8fafc')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Node interaction
    node
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on('mouseover', function() {
        d3.select(this)
          .attr('stroke-width', 3)
          .attr('stroke', '#60a5fa');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#1e293b');
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      node
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);

      label
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };

  }, [data]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current!);
    const newTransform = currentTransform.scale(1.5);
    svg.transition().duration(300).call(
      zoom.current.transform as never,
      newTransform
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current!);
    const newTransform = currentTransform.scale(0.67);
    svg.transition().duration(300).call(
      zoom.current.transform as never,
      newTransform
    );
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      zoom.current.transform as never,
      d3.zoomIdentity
    );
  };

  return (
    <div className="relative h-full w-full">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-md border border-slate-600 transition-colors"
          title="Zoom In"
        >
          ➕
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-md border border-slate-600 transition-colors"
          title="Zoom Out"
        >
          ➖
        </button>
        <button
          onClick={handleResetZoom}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-md border border-slate-600 transition-colors text-xs"
          title="Reset Zoom"
        >
          🎯
        </button>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 z-10 bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-xs">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-sm"
          >
            ✕
          </button>
          <h3 className="font-semibold text-slate-100 mb-2">{selectedNode.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span 
                className="font-medium"
                style={{ color: getCompletionColor(selectedNode.completionPercentage) }}
              >
                {selectedNode.completionPercentage}% Complete
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weight:</span>
              <span className="text-slate-200">{selectedNode.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level:</span>
              <span className="text-slate-200">{selectedNode.level}</span>
            </div>
            {selectedNode.children.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Children:</span>
                <span className="text-slate-200">{selectedNode.children.length}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-800 border border-slate-600 rounded-lg p-3">
        <h4 className="font-semibold text-slate-100 mb-2 text-sm">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCompletionColor(0) }}></div>
            <span className="text-slate-300">Not Started (0%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCompletionColor(50) }}></div>
            <span className="text-slate-300">In Progress (50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCompletionColor(100) }}></div>
            <span className="text-slate-300">Complete (100%)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full bg-slate-900"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}