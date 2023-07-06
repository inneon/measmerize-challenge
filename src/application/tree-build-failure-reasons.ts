export enum TreeBuildFailureReasons {
  duplicateNodeIds = "There are duplicate nodes in the tree",
  noTopLeftNode = "There is no top left node",
  nodeHasNullAsId = "A node has an id of 'null'",
  circularParentChildLoop = "There is a circular dependency",
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
interface TreeHasCircularParentChildLoop {
  type: TreeBuildFailureReasons.circularParentChildLoop
  nodeIdsInLoop: string[]
}

export type TreeBuildFailures =
  | DuplicateNodeIds
  | NoTopLeftNode
  | NodeHasNullAsId
  | TreeHasCircularParentChildLoop
