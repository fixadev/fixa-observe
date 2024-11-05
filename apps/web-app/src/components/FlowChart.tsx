"use client";

import React, { type ReactNode, useCallback, useEffect, useMemo } from "react";
import Dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeProps,
  Handle,
  Position,
  type Node,
  type Edge,
  useReactFlow,
  type EdgeProps,
  getBezierPath,
  BaseEdge,
  getSimpleBezierPath,
  getStraightPath,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

type StateNode = Node<{
  label: string;
  numFailures?: number;
  numForwards?: number;
  numSuccesses?: number;
  isHovered?: boolean;
}>;

type ResultNode = Node<{
  label: string;
  type: "failure" | "forward" | "success";
  numCalls?: number;
  isHovered?: boolean;
}>;

const totalCalls = 1000;
const initialNodes = [
  {
    id: "1",
    type: "state",
    position: { x: 0, y: 0 },
    data: { label: "Start of conversation", numSuccesses: 1000 },
  },
  {
    id: "2",
    type: "state",
    position: { x: 0, y: 0 },
    data: { label: "General question", numFailures: 100, numSuccesses: 200 },
  },
  {
    id: "3",
    type: "state",
    position: { x: 0, y: 0 },
    data: { label: "Order takeout", numFailures: 10, numSuccesses: 100 },
  },
  {
    id: "4",
    type: "state",
    position: { x: 0, y: 0 },
    data: {
      label: "Make reservation",
      numFailures: 400,
      numForwards: 90,
      numSuccesses: 100,
    },
  },
  {
    id: "5",
    type: "result",
    position: { x: 0, y: 0 },
    data: { label: "Failure", numCalls: 600 - 90, type: "failure" }, // 100 + 10 + 490 failures
  },
  {
    id: "6",
    type: "result",
    position: { x: 0, y: 0 },
    data: { label: "Forward call to human", numCalls: 90, type: "forward" }, // No forwards shown in data
  },
  {
    id: "7",
    type: "result",
    position: { x: 0, y: 0 },
    data: { label: "Success", numCalls: 400, type: "success" }, // 200 + 100 + 100 successes
  },
] as (StateNode | ResultNode)[];
const initialEdges = [
  {
    id: "e1-2",
    type: "stateEdge",
    source: "1",
    target: "2",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e1-3",
    type: "stateEdge",
    source: "1",
    target: "3",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e1-4",
    type: "stateEdge",
    source: "1",
    target: "4",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e2-5",
    type: "stateEdge",
    source: "2",
    target: "5",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e2-6",
    type: "stateEdge",
    source: "2",
    target: "6",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e2-7",
    type: "stateEdge",
    source: "2",
    target: "7",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e3-5",
    type: "stateEdge",
    source: "3",
    target: "5",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e3-6",
    type: "stateEdge",
    source: "3",
    target: "6",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e3-7",
    type: "stateEdge",
    source: "3",
    target: "7",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-5",
    type: "stateEdge",
    source: "4",
    target: "5",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-6",
    type: "stateEdge",
    source: "4",
    target: "6",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-7",
    type: "stateEdge",
    source: "4",
    target: "7",
    markerEnd: { type: MarkerType.Arrow },
  },
];

export default function FlowChart() {
  const nodeTypes = useMemo(
    () => ({ state: StateNode, result: ResultNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ stateEdge: StateEdge }), []);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = React.useState<string | null>(null);
  const adjacencyMap = useMemo(() => buildAdjacencyMap(edges), [edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes] as StateNode[]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      void fitView();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setHoveredNodeId(node.id);

      // Get adjacent node IDs from adjacency map
      const adjacentNodes = adjacencyMap.get(node.id) ?? new Set();

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isHovered: n.id === node.id || adjacentNodes.has(n.id),
          },
        })),
      );

      // Highlight edges connected to hovered node
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          data: {
            ...e.data,
            isHovered: e.source === node.id || e.target === node.id,
          },
        })),
      );
    },
    [setNodes, setEdges, adjacencyMap],
  );

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, isHovered: false },
      })),
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: { ...e.data, isHovered: false },
      })),
    );
  }, [setNodes, setEdges]);

  const onEdgeMouseEnter = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setHoveredEdgeId(edge.id);

      // Highlight the edge
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          data: { ...e.data, isHovered: e.id === edge.id },
        })),
      );

      // Highlight the connected nodes
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isHovered: n.id === edge.source || n.id === edge.target,
          },
        })),
      );
    },
    [setEdges, setNodes],
  );

  const onEdgeMouseLeave = useCallback(() => {
    setHoveredEdgeId(null);

    // Reset edge highlighting
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: { ...e.data, isHovered: false },
      })),
    );

    // Reset node highlighting
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, isHovered: false },
      })),
    );
  }, [setEdges, setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
      />
    </div>
  );
}

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: Record<string, string>,
) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
}

function buildAdjacencyMap(edges: Edge[]): Map<string, Set<string>> {
  const adjacencyMap = new Map<string, Set<string>>();

  edges.forEach((edge) => {
    // Initialize set for source if it doesn't exist
    if (!adjacencyMap.has(edge.source)) {
      adjacencyMap.set(edge.source, new Set());
    }
    // Add target to source's set
    adjacencyMap.get(edge.source)!.add(edge.target);
  });

  return adjacencyMap;
}

const RED = "#FE331B";
const YELLOW = "#FDCD2E";
const GREEN = "#90CF27";
// const GREEN = "white";

function StateNode({ id, data }: NodeProps<StateNode>) {
  const percentageOfTotalCalls = useMemo(() => {
    return (
      ((data.numFailures ?? 0) +
        (data.numForwards ?? 0) +
        (data.numSuccesses ?? 0)) /
      totalCalls
    );
  }, [data.numFailures, data.numForwards, data.numSuccesses]);

  const padding = useMemo(() => {
    return {
      horizontal: 2 + percentageOfTotalCalls * 8,
      vertical: 0.5 + percentageOfTotalCalls * 4,
    };
  }, [percentageOfTotalCalls]);

  const gradient = useMemo(() => {
    const total =
      (data.numFailures ?? 0) +
      (data.numForwards ?? 0) +
      (data.numSuccesses ?? 0);
    if (total === 0) return "white";

    const failurePercent = ((data.numFailures ?? 0) / total) * 100;
    const forwardPercent = ((data.numForwards ?? 0) / total) * 100;

    return `linear-gradient(to right, 
      ${RED} 0%, 
      ${RED} ${failurePercent}%, 
      ${YELLOW} ${failurePercent}%, 
      ${YELLOW} ${failurePercent + forwardPercent}%, 
      ${GREEN} ${failurePercent + forwardPercent}%, 
      ${GREEN} 100%
    )`;
  }, [data.numFailures, data.numForwards, data.numSuccesses]);

  const fontSize = useMemo(() => {
    // Scale from 0.75rem to 1.5rem based on percentage of total calls
    return 0.5 + percentageOfTotalCalls * 0.5;
  }, [percentageOfTotalCalls]);

  const textPadding = useMemo(() => {
    return 0.25 + percentageOfTotalCalls * 0.5;
  }, [percentageOfTotalCalls]);

  return (
    <>
      <Handle className="z-10" type="target" position={Position.Top} />
      <div
        className="relative rounded-md p-6 shadow-sm outline outline-2 outline-input"
        style={{
          padding: `${padding.vertical}rem ${padding.horizontal}rem`,
          background: gradient,
          transform: data.isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.1s ease-in-out",
        }}
      >
        <span className="invisible" style={{ fontSize: `${fontSize}rem` }}>
          {data.label}
        </span>
        <div
          className="absolute rounded-md bg-white shadow-sm"
          style={{
            fontSize: `${fontSize}rem`,
            padding: `${textPadding}rem`,
            top: `${textPadding}rem`,
            left: `${textPadding}rem`,
          }}
        >
          {data.label}
        </div>
        <div className="absolute bottom-0 left-0 h-[20%] w-full rounded-b-md bg-black/10"></div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

function ResultNode({ data }: NodeProps<ResultNode>) {
  const percentageOfTotalCalls = useMemo(
    () => (data.numCalls ?? 0) / totalCalls,
    [data.numCalls],
  );

  const padding = useMemo(() => {
    return {
      horizontal: 2 + percentageOfTotalCalls * 8,
      vertical: 1 + percentageOfTotalCalls * 4,
    };
  }, [percentageOfTotalCalls]);

  const backgroundColor = useMemo(() => {
    switch (data.type) {
      case "success":
        return GREEN;
      case "failure":
        return RED;
      case "forward":
        return YELLOW;
      default:
        return "white";
    }
  }, [data.type]);

  return (
    <>
      <Handle className="z-10" type="target" position={Position.Top} />
      <div
        className="relative rounded-md shadow-sm outline outline-2"
        style={{
          padding: `${padding.vertical}rem ${padding.horizontal}rem`,
          backgroundColor: `${backgroundColor}1A`,
          outlineColor: backgroundColor,
          transform: data.isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.1s ease-in-out",
        }}
      >
        {data.label}
        <div
          className="absolute left-0 top-0 h-[20%] w-full rounded-t-md"
          style={{ backgroundColor }}
        ></div>
      </div>
    </>
  );
}

function StateEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        strokeWidth: data?.isHovered ? 2 : 1,
        opacity: data?.isHovered ? 1 : 0.5,
      }}
    />
  );
}
