// This file details reasons why it might not be possible to build a tree.
// As mentioned in the README this is not a complete list of all the ways
// I thought the process could fail - see the tests for the `todo` test
// which I would complete if I had more time.

// The reasons for not being able to build a tree.
// Note that this implementaion is not quite right: the concerns of uniquely
// identifying each failure case is mixed with the concern of showing this as
// an output. With more time I would extract the translation from an interal
// failure reason to a external facing message (e.g. HTTP status codes) to the
// presentation layer.
export enum TreeBuildFailureReasons {
  duplicateNodeIds = "There are duplicate nodes in the tree",
  noTopLeftNode = "There is no top left node",
  nodeHasNullAsId = "A node has an id of 'null'",
  circularParentChildLoop = "There is a circular dependency in the parent-child relationships",
  circularSiblingLoop = "There is a circular dependency in the sibling relationships",
}

// Data structures capturing different failure modes. Note that some of
// these data structures are just a reason, but some can carry more
// detailed info about that failure (e.g. ids for ndoe that are duplicated)
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

interface TreeHasCircularSiblingLoop {
  type: TreeBuildFailureReasons.circularSiblingLoop
  nodeIdsInLoop: string[]
}

export type TreeBuildFailures =
  | DuplicateNodeIds
  | NoTopLeftNode
  | NodeHasNullAsId
  | TreeHasCircularParentChildLoop
  | TreeHasCircularSiblingLoop
