import { Node } from "./node"

export interface NodeTree {
  nodeId: string
  name: string
  parentId: string | null
  previousSiblingId: string | null
  children: NodeTree[]
}

export const toNodeTree = (node: Node): NodeTree => ({
  ...node,
  children: [],
})
