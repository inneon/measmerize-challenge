export interface Node {
  nodeId: string
  name: string
  parentId: string | null
  previousSiblingId: string | null
}

export type NodeList = Node[]
