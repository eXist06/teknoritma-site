"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Handle,
  Position,
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useI18n } from "@/lib/i18n";

interface LisWorkflowDiagramProps {
  translationKey: string;
}

// Custom Edge Component with animated test tube icon
// Sequential animation: each edge starts after the previous one completes
function AnimatedTubeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  sourceHandleId,
  targetHandleId,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Create unique path ID for this edge
  const pathId = `edge-path-${id}`;
  
  // Calculate animation delay based on edge order in workflow
  // Sequential flow: 1→2→3→(4→6, 5→7)→7→8→9, then loop back
  // Flow: 1→2 (0s) → 2→3 (2s) → 3→4/3→5 (4s, parallel - 2 tubes) → 4→6/5→7 (6s, parallel) → 7→8 (8s) → 8→9 (10s) → loop (12s)
  const getAnimationDelay = (edgeId: string): string => {
    const delays: Record<string, string> = {
      'e1-2': '0s',
      'e2-3': '2s',
      'e3-4': '4s',  // Branch 1 - starts same time as e3-5 (2 tubes appear)
      'e3-5': '4s',  // Branch 2 - parallel with e3-4 (2 tubes appear)
      'e4-6': '6s',  // Branch 1 continues
      'e5-7': '6s',  // Branch 2 continues (parallel)
      'e7-8': '8s',  // Merged back to single tube
      'e8-9': '10s', // Final step
    };
    return delays[edgeId] || '0s';
  };
  
  const animationDelay = getAnimationDelay(id);
  const animationDuration = '2s'; // Duration for each edge segment
  const totalCycleDuration = '12s'; // Total cycle time before loop

  // Enhanced edge style with gradient effect - shorter arrows
  const enhancedStyle = {
    ...style,
    stroke: style.stroke || "#0066FF",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))',
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={enhancedStyle}
        markerEnd={markerEnd}
      />
      {/* SVG definitions for animation path */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'visible' }}>
        <defs>
          <path id={pathId} d={edgePath} />
          {/* Gradient for test tube */}
          <linearGradient id={`tube-gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#0052CC" stopOpacity="1" />
          </linearGradient>
          {/* Glow filter for test tube */}
          <filter id={`tube-glow-${id}`}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      {/* Tüp animasyonu kaldırıldı - sadece edge çizgisi görünüyor */}
    </>
  );
}

// Regular edge without animation (for non-main flow edges)
function RegularEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  ...props
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Remove animated prop as it's not a valid HTML attribute
  const { animated, ...edgeProps } = props;
  
  return (
    <BaseEdge
      path={edgePath}
      style={style}
      markerEnd={markerEnd}
      {...edgeProps}
    />
  );
}

export default function LisWorkflowDiagram({ translationKey }: LisWorkflowDiagramProps) {
  const { t } = useI18n();

  // Custom Node Component - Enterprise design with modern styling
  const CustomNode = ({ data, id }: { data: any; id: string }) => {
    return (
      <div className="px-5 py-4 md:px-6 md:py-5 shadow-2xl rounded-xl md:rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/80 w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] hover:shadow-3xl hover:scale-105 hover:border-primary/60 transition-all duration-300 relative backdrop-blur-sm group">
        {/* Source Handles - for outgoing edges */}
        {id === "1" && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "2" && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "3" && (
          <>
            <Handle
              type="source"
              position={Position.Bottom}
              id="bottom"
              style={{ 
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
                width: "14px", 
                height: "14px", 
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)",
                left: "50%"
              }}
            />
            <Handle
              type="source"
              position={Position.Left}
              id="left"
              style={{ 
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
                width: "14px", 
                height: "14px", 
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)",
                top: "50%"
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="right"
              style={{ 
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
                width: "14px", 
                height: "14px", 
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)",
                top: "50%"
              }}
            />
          </>
        )}
        {id === "4" && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "5" && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "6" && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "7" && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "8" && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        
        {/* Target Handles - for incoming edges */}
        {id === "2" && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "3" && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "4" && (
          <Handle
            type="target"
            position={Position.Right}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "5" && (
          <Handle
            type="target"
            position={Position.Left}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "6" && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "7" && (
          <>
            <Handle
              type="target"
              position={Position.Left}
              id="left"
              style={{ 
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
                width: "14px", 
                height: "14px", 
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)",
                top: "30%"
              }}
            />
            <Handle
              type="target"
              position={Position.Top}
              id="top"
              style={{ 
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
                width: "14px", 
                height: "14px", 
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)",
                left: "50%"
              }}
            />
          </>
        )}
        {id === "8" && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        {id === "9" && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ 
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", 
              width: "14px", 
              height: "14px", 
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0, 102, 255, 0.4)"
            }}
          />
        )}
        
        {/* Icon container with gradient background */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/10">
            {id === "3" ? (
              <img 
                src="/dna_5903776.png" 
                alt="Analyser" 
                className="w-full h-full object-contain p-1"
              />
            ) : (
              data.icon
            )}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-base md:text-lg text-gray-900 leading-tight mb-2 md:mb-2.5 break-words group-hover:text-primary transition-colors duration-300">
              {data.label}
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words overflow-hidden line-clamp-3">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    );
};

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  
  const edgeTypes = useMemo(() => ({ 
    animatedTube: AnimatedTubeEdge,
    default: RegularEdge,
  }), []);

  // Define nodes based on workflow - Vertical flow (top to bottom)
  // Layout: Main flow down the center, branches to the sides
  const initialNodes: Node[] = useMemo(() => {
    // Center the flow vertically - fitView will handle responsive scaling
    const centerX = 400; // Center horizontally
    const startY = 60; // Start from top
    const verticalStep = 220; // Vertical spacing between main nodes
    const horizontalBranch = 280; // Spacing for side branches
    
    return [
      {
        id: "1",
        type: "custom",
        position: { x: centerX, y: startY }, // Start: Check-in (top-center)
        data: {
          label: t(`${translationKey}.workflow.steps.checkInSorting.title`),
          description: t(`${translationKey}.workflow.steps.checkInSorting.description`),
          icon: "🧪",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: centerX, y: startY + verticalStep }, // Worklist (center, below check-in)
        data: {
          label: t(`${translationKey}.workflow.steps.worklistRouting.title`),
          description: t(`${translationKey}.workflow.steps.worklistRouting.description`),
          icon: "📋",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: centerX, y: startY + (verticalStep * 2) }, // Analyser (center, below worklist)
        data: {
          label: t(`${translationKey}.workflow.steps.analyserInterfaces.title`),
          description: t(`${translationKey}.workflow.steps.analyserInterfaces.description`),
          icon: "🔬",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: centerX - horizontalBranch, y: startY + (verticalStep * 3) }, // Rerun (left branch)
        data: {
          label: t(`${translationKey}.workflow.steps.rerunReflex.title`),
          description: t(`${translationKey}.workflow.steps.rerunReflex.description`),
          icon: "🔄",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: centerX + horizontalBranch, y: startY + (verticalStep * 3) }, // Calibration (right branch)
        data: {
          label: t(`${translationKey}.workflow.steps.calibrationMaintenance.title`),
          description: t(`${translationKey}.workflow.steps.calibrationMaintenance.description`),
          icon: "🔧",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: centerX - horizontalBranch, y: startY + (verticalStep * 4) }, // QC (left, below rerun)
        data: {
          label: t(`${translationKey}.workflow.steps.qualityControl.title`),
          description: t(`${translationKey}.workflow.steps.qualityControl.description`),
          icon: "📊",
        },
      },
      {
        id: "7",
        type: "custom",
        position: { x: centerX + horizontalBranch, y: startY + (verticalStep * 4) }, // Results (right, below analyser)
        data: {
          label: t(`${translationKey}.workflow.steps.results.title`),
          description: t(`${translationKey}.workflow.steps.results.description`),
          icon: "📄",
        },
      },
      {
        id: "8",
        type: "custom",
        position: { x: centerX + horizontalBranch, y: startY + (verticalStep * 5) }, // Autoverification (right, below results)
        data: {
          label: t(`${translationKey}.workflow.steps.autoverification.title`),
          description: t(`${translationKey}.workflow.steps.autoverification.description`),
          icon: "✅",
        },
      },
      {
        id: "9",
        type: "custom",
        position: { x: centerX + horizontalBranch, y: startY + (verticalStep * 6) }, // Check-out (right, bottom)
        data: {
          label: t(`${translationKey}.workflow.steps.checkOutStorage.title`),
          description: t(`${translationKey}.workflow.steps.checkOutStorage.description`),
          icon: "📦",
        },
      },
    ];
  }, [t, translationKey]);

  // Define edges (connections) - matching the circular workflow flow
  // Flow: 1→2→3→(4→6, 5→7)→7→8→9 (pre-analytical flow pattern)
  const initialEdges: Edge[] = useMemo(() => [
    { 
      id: "e1-2", 
      source: "1", 
      target: "2", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 4,
        strokeOpacity: 0.9,
        strokeDasharray: "0",
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e2-3", 
      source: "2", 
      target: "3", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e3-4", 
      source: "3", 
      sourceHandle: "left",
      target: "4", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e3-5", 
      source: "3", 
      sourceHandle: "right",
      target: "5", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e4-6", 
      source: "4", 
      target: "6", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e5-7", 
      source: "5", 
      target: "7", 
      targetHandle: "top",
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e6-7", 
      source: "6", 
      target: "7", 
      targetHandle: "left",
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e7-8", 
      source: "7", 
      target: "8", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
    { 
      id: "e8-9", 
      source: "8", 
      target: "9", 
      type: "animatedTube",
      animated: false,
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
      style: { 
        stroke: "#0066FF", 
        strokeWidth: 3,
        strokeOpacity: 0.9,
        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
      } 
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
    setTimeout(() => {
      instance.fitView({ 
        padding: 0.08, 
        duration: 0,
        minZoom: 0.35,
        maxZoom: 1.2
      });
    }, 100);
  }, []);

  // Calculate responsive height - full screen with responsive adjustments
  const [containerHeight, setContainerHeight] = useState(800);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const headerHeight = 200; // Approximate header/nav height
      const sectionPadding = 120; // Section padding (title + margins)
      const calculatedHeight = vh - headerHeight - sectionPadding;
      
      setIsMobile(vw < 768);
      
      if (vw < 768) {
        setContainerHeight(Math.max(800, calculatedHeight));
      } else if (vw < 1024) {
        setContainerHeight(Math.max(900, calculatedHeight));
      } else {
        setContainerHeight(Math.max(1000, Math.min(calculatedHeight, 1200)));
      }
    };
    
    if (typeof window !== 'undefined') {
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

  // Fit view when container height changes or nodes update - responsive
  useEffect(() => {
    if (reactFlowInstance) {
      const timer = setTimeout(() => {
        const padding = isMobile ? 0.12 : 0.08;
        const minZoom = isMobile ? 0.3 : 0.35;
        reactFlowInstance.fitView({ 
          padding, 
          duration: 0,
          minZoom,
          maxZoom: 1.2
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [containerHeight, reactFlowInstance, nodes, isMobile]);

  // Prevent React Flow from capturing scroll events - allow page scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Find React Flow viewport
      const target = e.target as HTMLElement;
      const reactFlowViewport = target.closest('.react-flow__viewport');
      
      if (reactFlowViewport) {
        // Allow page scroll to continue
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        const viewport = reactFlowViewport as HTMLElement;
        const isAtTop = viewport.scrollTop === 0;
        const isAtBottom = viewport.scrollHeight - viewport.scrollTop <= viewport.clientHeight + 1;
        
        // If at boundaries, allow page scroll
        if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
          // Don't prevent default - let page scroll
          return;
        }
      }
    };
    
    // Use capture phase to intercept before React Flow
    document.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true } as any);
    };
  }, []);

  return (
    <div 
      className="w-full border border-gray-200/50 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm shadow-2xl"
      style={{ height: `${containerHeight}px`, minHeight: '600px' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "animatedTube",
          animated: false,
          style: { 
            stroke: "#0066FF", 
            strokeWidth: 4,
            strokeOpacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.3))'
          },
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: "#0066FF",
            width: 16,
            height: 16
          },
        }}
        minZoom={0.5}
        maxZoom={1.5}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        panOnScroll={false}
      >
        <Background 
          color="#f3f4f6" 
          gap={20} 
          size={1}
          style={{ opacity: 0.4 }}
        />
      </ReactFlow>
    </div>
  );
}

