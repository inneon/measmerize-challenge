import { TreeBuildFailureReasons, TreeBuildFailures } from "../application"

// This file reports errors in a human readable format so that the core business logic is
// kept pure from display concerns. We could additionally present the errors differently for
// different presentation methods (e.g. for HTTP service we would also want a HTTP status
// code in addition to a human readable message). This layer of abstraction also allows for
// different languages to be supported without polluting the core business layer.
export const toHumanReadable = (failure: TreeBuildFailures): string => {
  const errorMessage = reasonToHumanReadable(failure.type)

  if (failure.type === TreeBuildFailureReasons.duplicateNodeIds) {
    return `${errorMessage}: node ids are ${failure.nodeIds.join(", ")}`
  }
  if (failure.type === TreeBuildFailureReasons.circularParentChildLoop) {
    return `${errorMessage}: node ids in the loop are ${failure.nodeIdsInLoop.join(
      ", ",
    )}`
  }
  if (failure.type === TreeBuildFailureReasons.invalidChildrenList) {
    return `${errorMessage}: invalid node ids are ${failure.invalidChildIds.join(
      ", ",
    )}`
  }

  return errorMessage
}

const reasonToHumanReadable = (reason: TreeBuildFailureReasons): string => {
  switch (reason) {
    case TreeBuildFailureReasons.duplicateNodeIds:
      return "There are duplicate nodes in the tree"
    case TreeBuildFailureReasons.noTopLeftNode:
      return "There is no top left node"
    case TreeBuildFailureReasons.nodeHasNullAsId:
      return "A node has an id of 'null'"
    case TreeBuildFailureReasons.circularParentChildLoop:
      return "There is a circular dependency in the parent-child relationships"
    case TreeBuildFailureReasons.invalidChildrenList:
      return "The children could not be built"
  }
}
