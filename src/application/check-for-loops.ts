import { NodeTree } from "../domain"

export const checkForLoops = (nodesById: {
  [key: string]: NodeTree
}): string[][] => {
  // Define the function for checking a single node...
  const nodeIdsConnectedToRoot: string[] = []
  const checkNodeForLoop = (
    node: NodeTree,
    seenIds: string[] = [],
  ): string[] | "success" => {
    if (seenIds.indexOf(node.nodeId) !== -1) {
      // This is a loop
      return seenIds
    } else if (
      node.parentId === null ||
      nodeIdsConnectedToRoot.indexOf(node.parentId) !== -1
    ) {
      // This is not a loop
      nodeIdsConnectedToRoot.push(...seenIds)
      return "success"
    } else {
      // Recursive case
      return checkNodeForLoop(nodesById[node.parentId], [
        ...seenIds,
        node.nodeId,
      ])
    }
  }

  // ... then use it to check all nodes ...
  const loops = Object.values(nodesById).reduce<string[][]>(
    (accumulator, node) => {
      const loopCheckResult = checkNodeForLoop(node)
      if (loopCheckResult !== "success") {
        accumulator.push(loopCheckResult)
      }
      return accumulator
    },
    [],
  )

  // ... then de-duplicate, as a loop with always include (at least) 2 elements
  const deduplicated = loops.reduce<{ [key: string]: string[] }>(
    (accumulator, current) => {
      const ordered = current.sort()
      // Key will be identical between duplicated entries and so overwrite
      const key = ordered.join(",")
      return {
        ...accumulator,
        [key]: ordered,
      }
    },
    {},
  )

  return Object.values(deduplicated)
}
