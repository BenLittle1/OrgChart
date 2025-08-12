'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '../../types';
import { convertToGraphData, getCompletionColor } from '../../lib/utils';
import { useOrgData } from '../../context/DataContext';

interface D3Node extends GraphNode, d3.SimulationNodeDatum {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  strength?: number;
}

interface GraphVisualizationProps {
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
}

export default function GraphVisualization({ 
  width = 800, 
  height = 600, 
  onNodeClick 
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const orgData = useOrgData();

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: rect.height || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]); // Re-run when fullscreen state changes

  // Handle fullscreen state synchronization
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fullscreen toggle functions
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const createVisualization = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width: w, height: h } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // Convert org data to graph data
    const graphData: GraphData = convertToGraphData(orgData);
    const nodes: D3Node[] = graphData.nodes.map(d => ({ ...d }));
    const links: D3Link[] = graphData.links.map(d => ({
      source: d.source,
      target: d.target,
      strength: d.strength,
    }));

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append('g');
    
    // Set initial zoom to be more zoomed out while keeping center
    const initialScale = 0.25;
    const centerX = w / 2;
    const centerY = h / 2;
    const initialTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(initialScale)
      .translate(-centerX, -centerY);
    
    svg.call(zoom.transform, initialTransform);

    // Create force simulation
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links)
        .id((d: any) => d.id)
        .distance((d: any) => {
          const source = d.source as D3Node;
          const target = d.target as D3Node;
          // Increased distances to accommodate larger nodes
          return 80 + (source.level + target.level) * 20;
        })
        .strength(0.8)
      )
      .force('charge', d3.forceManyBody()
        .strength((d: any) => {
          const node = d as D3Node;
          // Increased charge force to accommodate larger nodes and distances
          const baseStrength = -400;
          const levelMultiplier = Math.max(1, 3 - node.level);
          const weightMultiplier = Math.sqrt(node.weight);
          return baseStrength * levelMultiplier * weightMultiplier;
        })
      )
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide()
        .radius((d: any) => {
          const node = d as D3Node;
          return Math.max(15, Math.sqrt(node.weight) * 6 + 4);
        })
        .strength(0.8)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    simulationRef.current = simulation;

    // Create links
    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => {
        const source = d.source as D3Node;
        const target = d.target as D3Node;
        return Math.max(1, 3 - Math.max(source.level, target.level));
      });

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer');

    // Node circles - increased size multiplier for better visual hierarchy
    node.append('circle')
      .attr('r', d => Math.max(12, Math.sqrt(d.weight) * 6))
      .attr('fill', d => getCompletionColor(d.completion))
      .attr('stroke', d => selectedNode === d.id ? '#1e293b' : '#fff')
      .attr('stroke-width', d => selectedNode === d.id ? 3 : 2)
      .attr('opacity', 0.9);

    // Node labels - show full text with word wrapping for better readability
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const radius = Math.max(12, Math.sqrt(d.weight) * 6);
      const fontSize = Math.max(11, 16 - d.level * 2) * Math.min(1.5, Math.sqrt(d.weight) / 3);
      
      // Split long text into multiple lines
      const words = d.name.split(/\s+/);
      const maxCharsPerLine = Math.max(8, Math.floor(radius / 3));
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      // Limit to maximum 3 lines to prevent excessive height
      const displayLines = lines.slice(0, 3);
      if (lines.length > 3) {
        displayLines[2] = displayLines[2].substring(0, maxCharsPerLine - 3) + '...';
      }
      
      // Create text elements for each line - ensure black and visible text
      displayLines.forEach((line, i) => {
        nodeGroup.append('text')
          .text(line)
          .attr('font-size', `${fontSize}px`)
          .attr('font-weight', d.level <= 1 ? 'bold' : 'normal')
          .attr('text-anchor', 'middle')
          .attr('dy', radius + 18 + (i * fontSize * 1.1)) // Line spacing
          .attr('fill', '#000000') // Pure black text
          .attr('stroke', '#ffffff') // White outline for contrast
          .attr('stroke-width', '1') // Slightly thicker outline
          .attr('stroke-opacity', '1') // Full opacity outline
          .attr('pointer-events', 'none')
          .style('paint-order', 'stroke fill') // Ensure stroke renders behind fill
          .style('text-shadow', '2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9)'); // Enhanced shadow
      });
    });

    // Node interactions
    node
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.id === selectedNode ? null : d.id);
        if (onNodeClick) {
          onNodeClick(d);
        }
      })
      .on('mouseover', function(event, d) {
        // Highlight connected nodes
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.max(15, Math.sqrt(d.weight) * 6 + 3))
          .attr('opacity', 1);

        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('id', 'graph-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);

        tooltip.html(`
          <div><strong>${d.name}</strong></div>
          <div>Level: ${d.level}</div>
          <div>Progress: ${Math.round(d.completion * 100)}%</div>
          <div>Weight: ${d.weight}</div>
          <div>Type: ${d.isLeaf ? 'Task' : 'Category'}</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        d3.select('#graph-tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.max(12, Math.sqrt(d.weight) * 6))
          .attr('opacity', 0.9);

        d3.select('#graph-tooltip').remove();
      });

    // Drag behavior
    const drag = d3.drag<any, D3Node>()
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
      });

    node.call(drag as any);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as D3Node).x!)
        .attr('y1', (d: any) => (d.source as D3Node).y!)
        .attr('x2', (d: any) => (d.target as D3Node).x!)
        .attr('y2', (d: any) => (d.target as D3Node).y!);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Click background to deselect
    svg.on('click', () => {
      setSelectedNode(null);
    });

  }, [orgData, dimensions, selectedNode, onNodeClick]);

  // Create visualization when component mounts or data changes
  useEffect(() => {
    createVisualization();
    
    // Cleanup on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      d3.select('#graph-tooltip').remove();
    };
  }, [createVisualization]);

  // Update node selection styling
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('circle')
      .attr('stroke', (d: any) => selectedNode === d.id ? '#1e293b' : '#fff')
      .attr('stroke-width', (d: any) => selectedNode === d.id ? 3 : 2);
  }, [selectedNode]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[600px] bg-white rounded-lg border border-slate-200 overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)' }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-sm border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Legend</h4>
        
        {/* Progress Colors */}
        <div className="space-y-2 text-xs mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>0% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>50% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>100% Complete</span>
          </div>
        </div>
        
        {/* Node Size */}
        <div className="pt-2 border-t border-slate-200 mb-3">
          <div className="text-xs font-medium text-slate-700 mb-2">Node Size</div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <span>Tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full bg-slate-400"></div>
              <span>Categories</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Larger = More subtasks
          </div>
        </div>
        
        <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
          Click to select • Drag to move • Scroll to zoom
        </div>
      </div>
      
      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 btn-secondary p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          // Compress/Exit Fullscreen Icon
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5" 
            />
          </svg>
        ) : (
          // Expand/Enter Fullscreen Icon
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 8V4m0 0h4M4 4l5.5 5.5M20 8V4m0 0h-4m4 0l-5.5 5.5M4 16v4m0 0h4m-4 0l5.5-5.5M20 16v4m0 0h-4m4 0l-5.5-5.5" 
            />
          </svg>
        )}
      </button>
    </div>
  );
}