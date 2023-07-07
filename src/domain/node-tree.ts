import { Node } from "./node"

export interface TreeNode {
  nodeId: string
  name: string
  parentId: string | null
  previousSiblingId: string | null
  children: TreeNode[]
}

export const toNodeTree = (node: Node): TreeNode => ({
  ...node,
  children: [],
})
