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

  return success(topLevel)
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

const orderChildren = (
  children: NodeTree[],
  key: string | null = null,
): NodeTree[] => {
  if (children.length === 0) return []

  const maybeNextChild = children.find(
    (child) => child.previousSiblingId === key,
  )
  if (!maybeNextChild) return []

  const nextChild = maybeNextChild as NodeTree

  return [nextChild, ...orderChildren(children, nextChild.nodeId)]
}
