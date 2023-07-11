import {
  NodeList,
  NodeTree,
  OperationResult,
  success,
  failure,
  toNodeTree,
} from "../domain"
import { checkForLoops } from "./check-for-loops"
import { prechecks } from "./prechecks"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

// Here is the main "application logic". My goal was to divide the process of building the
// tree into 3 steps: some pre-checks to check it is possible to attempt to build a tree
// (e.g. each node id is unique), attempting to build the tree, and some more post checks
// (e.g. that there are no loops, and every node is connected to the root). At each stage
// the logic should be able to produce either a Success, or a list of errors detailing why
// it cannot continue.
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

  // Building the output tree
  // First build the general shape of the tree (parent-child relationships)...
  Object.values(nodeMap).forEach((node) => {
    const parentId = node.parentId
    if (parentId === null) {
      topLevel.push(node)
    } else {
      nodeMap[parentId].children.push(node)
    }
  })

  // ... then put the children in the right order
  const buildChildrenErrors = Object.values(nodeMap).reduce<
    TreeBuildFailures[]
  >((errorAccumulator, node) => {
    const { orderedChildren, errors } = orderChildren(node.children)
    node.children = orderedChildren
    return [...errorAccumulator, ...errors]
  }, [])
  const { orderedChildren: orderedTopLevel, errors: topLevelOrderErrors } =
    orderChildren(topLevel)

  if ([...buildChildrenErrors, ...topLevelOrderErrors].length) {
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

  return success(orderedTopLevel)
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
