export enum TreeBuildFailureReasons {
  duplicateNodeIds,
  noTopLeftNode,
  nodeHasNullAsId,
}

interface DuplicateNodeIds {
  type: TreeBuildFailureReasons.duplicateNodeIds
  nodeIds: string[]
}

interface NoTopLeftNode {
  type: TreeBuildFailureReasons.noTopLeftNode
}

interface NodeHasNullAsId {
  type: TreeBuildFailureReasons.nodeHasNullAsId
}

export type TreeBuildFailures =
  | DuplicateNodeIds
  | NoTopLeftNode
  | NodeHasNullAsId
