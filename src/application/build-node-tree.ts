import {
  NodeList,
  NodeTree,
  OperationResult,
  success,
  failure,
  toNodeTree,
} from "../domain"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

// Here is the main "application logic". My goal was to divide the process of building the
// tree into 3 steps: some pre-checks to check it is possible to attempt to build a tree
// (e.g. each node id is unique), attempting to build the tree, and some more post checks
// (e.g. that there are no loops, and every node is connected to the root). At each stage
// the logic should be able to produce either a Success, or a list of errors detailing why
// it cannot continue. I did not complete the post checks yet.
export const buildNodeTree = (
  nodeList: NodeList,
): OperationResult<NodeTree[], TreeBuildFailures> => {
  const precheckResult: OperationResult<NodeList, TreeBuildFailures> =
    prechecks(nodeList)
  if (precheckResult.result === "error") {
    return failure(precheckResult.errors)
  }

  const nodeMap: { [key: string]: NodeTree } = nodeList.reduce((prev, curr) => {
    return { ...prev, [curr.nodeId]: toNodeTree(curr) }
  }, {})

  const topLevel: NodeTree[] = []

  Object.values(nodeMap).forEach((node) => {
    const parentId = node.parentId
    if (parentId === null) {
      topLevel.unshift(node)
    } else {
      nodeMap[parentId].children.unshift(node)
    }
  })

  Object.values(nodeMap).forEach(
    (node) => (node.children = orderChildren(node.children)),
  )

  return success(orderChildren(topLevel))
}

const prechecks = (
  nodeList: NodeList,
): OperationResult<NodeList, TreeBuildFailures> => {
  const keys: { [key: string]: true } = {}
  const duplicates: string[] = []
  let hasFoundTopLeft = false
  let hasNullAsNodeId = false

  nodeList.forEach(({ nodeId, parentId, previousSiblingId }) => {
    if (keys[nodeId]) {
      duplicates.unshift(nodeId)
    } else {
      keys[nodeId] = true
    }
    if (parentId === null && previousSiblingId === null) {
      hasFoundTopLeft = true
    }
    if (nodeId === "null") {
      hasNullAsNodeId = true
    }
  })

  const errors: TreeBuildFailures[] = []

  if (duplicates.length) {
    errors.unshift({
      type: TreeBuildFailureReasons.duplicateNodeIds,
      nodeIds: duplicates,
    })
  }
  if (!hasFoundTopLeft) {
    errors.unshift({
      type: TreeBuildFailureReasons.noTopLeftNode,
    })
  }
  if (hasNullAsNodeId) {
    errors.unshift({
      type: TreeBuildFailureReasons.nodeHasNullAsId,
    })
  }

  if (errors.length) {
    return failure(errors)
  }

  return success(nodeList)
}

const orderChildren = (children: NodeTree[]) => {
  const mapByPrevious: { [key: string]: NodeTree } = children.reduce<{
    [key: string]: NodeTree
  }>(
    (accumulator, current) => ({
      ...accumulator,
      [current.previousSiblingId ?? "null"]: current,
    }),
    {},
  )

  const result: NodeTree[] = []

  let current = mapByPrevious["null"]
  let loopBound = 100000 // some arbitrarily large number

  while (current) {
    result.push(current)
    current = mapByPrevious[current.nodeId]
    loopBound--
    if (loopBound < 0) throw Error("something went wrong reordering children")
  }

  return result
}
