"use client";

import {
  ReactFlow,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type ReactNode, useMemo } from "react";

const nodes = [
  {
    id: "system-prompt",
    type: "customNode",
    position: { x: 50, y: 50 },
    data: {
      label: (
        <div className="w-[300px] rounded-md border border-input bg-background p-4 shadow-sm">
          <div className="text-xs font-medium">system prompt</div>
          <div className="mt-2 text-xs text-muted-foreground">
            you are a helpful restaurant assistant. you can help customers make
            reservations, answer questions about the menu, and take takeout
            orders.
          </div>
        </div>
      ),
      showLeftHandle: false,
      showRightHandle: true,
    },
  },
  {
    id: "reservation",
    type: "customNode",
    position: { x: 450, y: 0 },
    data: {
      label: (
        <div className="w-[200px] rounded-md border border-input bg-background p-4 shadow-sm">
          <div className="text-xs font-medium">make a reservation</div>
        </div>
      ),
      showLeftHandle: true,
      showRightHandle: false,
    },
  },
  {
    id: "menu",
    type: "customNode",
    position: { x: 450, y: 75 },
    data: {
      label: (
        <div className="w-[200px] rounded-md border border-input bg-background p-4 shadow-sm">
          <div className="text-xs font-medium">ask about menu</div>
        </div>
      ),
      showLeftHandle: true,
      showRightHandle: false,
    },
  },
  {
    id: "takeout",
    type: "customNode",
    position: { x: 450, y: 150 },
    data: {
      label: (
        <div className="w-[200px] rounded-md border border-input bg-background p-4 shadow-sm">
          <div className="text-xs font-medium">place takeout order</div>
        </div>
      ),
      showLeftHandle: true,
      showRightHandle: false,
    },
  },
];

const edges: Edge[] = [
  {
    id: "system-to-reservation",
    source: "system-prompt",
    target: "reservation",
    markerEnd: {
      type: MarkerType.Arrow,
    },
    // type: "smoothstep",
  },
  {
    id: "system-to-menu",
    source: "system-prompt",
    target: "menu",
    markerEnd: {
      type: MarkerType.Arrow,
    },
    // type: "smoothstep",
  },
  {
    id: "system-to-takeout",
    source: "system-prompt",
    target: "takeout",
    markerEnd: {
      type: MarkerType.Arrow,
    },
    // type: "smoothstep",
  },
];

export default function ImportAgentFlow() {
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  return (
    <div className="pointer-events-none h-[240px] w-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        panOnDrag={false}
        proOptions={{ hideAttribution: true }}
      ></ReactFlow>
    </div>
  );
}

function CustomNode({
  data,
}: NodeProps<
  Node<{
    label: ReactNode;
    showLeftHandle?: boolean;
    showRightHandle?: boolean;
  }>
>) {
  return (
    <>
      {data.showLeftHandle && <Handle type="target" position={Position.Left} />}
      <div>{data.label}</div>
      {data.showRightHandle && (
        <Handle type="source" position={Position.Right} />
      )}
    </>
  );
}
