import {
  NodeList,
  NodeTree,
  OperationResult,
  success,
  failure,
  Node,
  toNodeTree,
} from "../domain"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

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

  return success(topLevel)
}

const prechecks = (
  nodeList: NodeList,
): OperationResult<NodeList, TreeBuildFailures> => {
  const keys: { [key: string]: true } = {}
  const duplicates: string[] = []

  nodeList.forEach(({ nodeId }) => {
    if (keys[nodeId]) {
      duplicates.unshift(nodeId)
    } else {
      keys[nodeId] = true
    }
  })

  if (duplicates.length) {
    return failure([
      {
        type: TreeBuildFailureReasons.duplicateNodeIds,
        nodeIds: duplicates,
      },
    ])
  }

  return success(nodeList)
}
