import {
  NodeList,
  NodeTree,
  OperationResult,
  success,
  failure,
  toNodeTree,
} from "../domain"
import { checkForLoops } from "./check-for-loops"
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
      topLevel.push(node)
    } else {
      nodeMap[parentId].children.push(node)
    }
  })

  const buildChildrenErrors = Object.values(nodeMap).reduce<
    TreeBuildFailures[]
  >((errorAccumulator, node) => {
    const { orderedChildren, errors } = orderChildren(node.children)
    node.children = orderedChildren
    return [...errorAccumulator, ...errors]
  }, [])

  if (buildChildrenErrors.length) {
    return failure(buildChildrenErrors)
  }

  const loops = checkForLoops(nodeMap)
  if (loops.length) {
    return failure(
      loops.map((loop) => ({
        type: TreeBuildFailureReasons.circularParentChildLoop,
        nodeIdsInLoop: loop,
      })),
    )
  }

  return success(orderChildren(topLevel).orderedChildren)
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

interface OrderChildrenResult {
  orderedChildren: NodeTree[]
  errors: TreeBuildFailures[]
}

const orderChildren = (children: NodeTree[]): OrderChildrenResult => {
  const result: NodeTree[] = []
  const errors: TreeBuildFailures[] = []

  const { mapByPrevious, errors: buildChildMapErrors } = children.reduce<{
    mapByPrevious: { [key: string]: NodeTree }
    errors: TreeBuildFailures[]
  }>(
    ({ mapByPrevious, errors }, current) => {
      const conflictingSibling =
        mapByPrevious[current.previousSiblingId ?? "null"]
      if (conflictingSibling) {
        return {
          mapByPrevious,
          errors: [
            ...errors,
            {
              type: TreeBuildFailureReasons.invalidChildrenList,
              invalidChildIds: [
                conflictingSibling.nodeId,
                current.nodeId,
              ].sort(),
            },
          ],
        }
      }
      return {
        mapByPrevious: {
          ...mapByPrevious,
          [current.previousSiblingId ?? "null"]: current,
        },
        errors,
      }
    },
    { mapByPrevious: {}, errors: [] },
  )

  errors.push(...buildChildMapErrors)

  let current = mapByPrevious["null"]
  let loopBound = 1000000 // some arbitrarily large number

  while (current) {
    result.push(current)
    current = mapByPrevious[current.nodeId]
    loopBound--
    if (loopBound < 0) throw Error("something went wrong reordering children")
  }

  const placeableChildren = Object.values(mapByPrevious)
  if (result.length < placeableChildren.length) {
    const placedChildrenIds = result.map(({ nodeId }) => nodeId)
    const unplacedChildIds = placeableChildren
      .map(({ nodeId }) => nodeId)
      .filter(
        (originalChildId) => placedChildrenIds.indexOf(originalChildId) === -1,
      )
    errors.push({
      type: TreeBuildFailureReasons.invalidChildrenList,
      invalidChildIds: unplacedChildIds.sort(),
    })
  }

  return { orderedChildren: result, errors }
}
