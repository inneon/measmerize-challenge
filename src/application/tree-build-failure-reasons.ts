// This file details reasons why it might not be possible to build a tree.
// As mentioned in the README this is not a complete list of all the ways
// I thought the process could fail - see the tests for the `todo` test
// which I would complete if I had more time.

// The reasons for not being able to build a tree.
export enum TreeBuildFailureReasons {
  duplicateNodeIds,
  noTopLeftNode,
  nodeHasNullAsId,
  circularParentChildLoop,
  // There are a few reasons for this error to occur (circular loops, duplicate ids, invalid ids).
  // In the interests of not spending forever on this challenge I have lumped them all together.
  invalidChildrenList,
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

interface InvalidChildrenList {
  type: TreeBuildFailureReasons.invalidChildrenList
  invalidChildIds: string[]
}

export type TreeBuildFailures =
  | DuplicateNodeIds
  | NoTopLeftNode
  | NodeHasNullAsId
  | TreeHasCircularParentChildLoop
  | InvalidChildrenList
