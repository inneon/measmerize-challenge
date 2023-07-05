export enum TreeBuildFailureReasons {
  duplicateNodeIds,
}

interface DuplicateNodeIds {
  type: TreeBuildFailureReasons.duplicateNodeIds
  nodeIds: string[]
}

export type TreeBuildFailures = DuplicateNodeIds
