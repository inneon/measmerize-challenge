import { OperationResult, NodeList, failure, success } from "../domain"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

export const prechecks = (
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
