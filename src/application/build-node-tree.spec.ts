import { NodeList, NodeTree, OperationResult } from "../domain"
import { buildNodeTree } from "./build-node-tree"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

describe("building a node tree", () => {
  it("gives the example output for the given input", () => {
    const nodeList: NodeList = [
      {
        nodeId: "4",
        name: "Four",
        parentId: "2",
        previousSiblingId: "6",
      },
      {
        nodeId: "8",
        name: "Eight",
        parentId: "7",
        previousSiblingId: null,
      },
      {
        nodeId: "2",
        name: "Two",
        parentId: "1",
        previousSiblingId: null,
      },
      {
        nodeId: "6",
        name: "Six",
        parentId: "2",
        previousSiblingId: null,
      },
      {
        nodeId: "3",
        name: "Three",
        parentId: null,
        previousSiblingId: null,
      },
      {
        nodeId: "5",
        name: "Five",
        parentId: "4",
        previousSiblingId: null,
      },
      {
        nodeId: "7",
        name: "Seven",
        parentId: null,
        previousSiblingId: "1",
      },
      {
        nodeId: "1",
        name: "One",
        parentId: null,
        previousSiblingId: "3",
      },
    ]

    const actual = buildNodeTree(nodeList)

    const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
      result: "success",
      value: [
        {
          nodeId: "3",
          name: "Three",
          parentId: null,
          previousSiblingId: null,
          children: [],
        },
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: "3",
          children: [
            {
              nodeId: "2",
              name: "Two",
              parentId: "1",
              previousSiblingId: null,
              children: [
                {
                  nodeId: "6",
                  name: "Six",
                  parentId: "2",
                  previousSiblingId: null,
                  children: [],
                },
                {
                  nodeId: "4",
                  name: "Four",
                  parentId: "2",
                  previousSiblingId: "6",
                  children: [
                    {
                      nodeId: "5",
                      name: "Five",
                      parentId: "4",
                      previousSiblingId: null,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeId: "7",
          name: "Seven",
          parentId: null,
          previousSiblingId: "1",
          children: [
            {
              nodeId: "8",
              name: "Eight",
              parentId: "7",
              previousSiblingId: null,
              children: [],
            },
          ],
        },
      ],
    }
    expect(actual).toEqual(expected)
  })

  describe("happy paths", () => {
    it("can build a tree from a single node", () => {
      const nodeList: NodeList = [
        {
          name: "Three",
          nodeId: "3",
          parentId: null,
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "success",
        value: [
          {
            name: "Three",
            nodeId: "3",
            parentId: null,
            previousSiblingId: null,
            children: [],
          },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it("can build a tree parent child tree with the parent first", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "2",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "success",
        value: [
          {
            nodeId: "1",
            name: "One",
            parentId: null,
            previousSiblingId: null,
            children: [
              {
                nodeId: "2",
                name: "Two",
                parentId: "1",
                previousSiblingId: null,
                children: [],
              },
            ],
          },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it("can put siblings in the correct order", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "2",
          name: "Two",
          parentId: "1",
          previousSiblingId: "3",
        },
        {
          nodeId: "3",
          name: "Three",
          parentId: "1",
          previousSiblingId: null,
        },
        {
          nodeId: "4",
          name: "Four",
          parentId: "1",
          previousSiblingId: "2",
        },
      ]

      const actual = buildNodeTree(nodeList)
      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "success",
        value: [
          {
            nodeId: "1",
            name: "One",
            parentId: null,
            previousSiblingId: null,
            children: [
              {
                nodeId: "3",
                name: "Three",
                parentId: "1",
                previousSiblingId: null,
                children: [],
              },
              {
                nodeId: "2",
                name: "Two",
                parentId: "1",
                previousSiblingId: "3",
                children: [],
              },
              {
                nodeId: "4",
                name: "Four",
                parentId: "1",
                previousSiblingId: "2",
                children: [],
              },
            ],
          },
        ],
      }
      expect(actual).toEqual(expected)
    })
  })

  describe("sad paths", () => {
    it("rejects node list that have duplicate ids", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.duplicateNodeIds,
            nodeIds: ["1"],
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when there is not a top left node", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.noTopLeftNode,
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when there is a loop in parent-child relationships", () => {
      const nodeList: NodeList = [
        {
          nodeId: "Top",
          name: "Top",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "Loop1",
          name: "Loop1",
          parentId: "Loop2",
          previousSiblingId: null,
        },
        {
          nodeId: "Loop2",
          name: "Loop2",
          parentId: "Loop1",
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.circularParentChildLoop,
            nodeIdsInLoop: ["Loop1", "Loop2"],
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when there is a loop in siblings", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "2",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
        {
          nodeId: "3",
          name: "Three",
          parentId: "1",
          previousSiblingId: "4",
        },
        {
          nodeId: "4",
          name: "Four",
          parentId: "1",
          previousSiblingId: "3",
        },
      ]

      const actual = buildNodeTree(nodeList)
      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.invalidChildrenList,
            invalidChildIds: ["3", "4"],
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when there two nodes have the same previous sibling", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "2",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
        {
          nodeId: "3",
          name: "Three",
          parentId: "1",
          previousSiblingId: "2",
        },
        {
          nodeId: "4",
          name: "Four",
          parentId: "1",
          previousSiblingId: "2",
        },
      ]

      const actual = buildNodeTree(nodeList)
      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.invalidChildrenList,
            invalidChildIds: ["3", "4"],
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when there a parent previous-sibling is not valid", () => {
      const nodeList: NodeList = [
        {
          nodeId: "1",
          name: "One",
          parentId: null,
          previousSiblingId: null,
        },
        {
          nodeId: "2",
          name: "Two",
          parentId: "1",
          previousSiblingId: null,
        },
        {
          nodeId: "3",
          name: "Three",
          parentId: "1",
          previousSiblingId: "This id doesn't exist",
        },
      ]

      const actual = buildNodeTree(nodeList)
      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.invalidChildrenList,
            invalidChildIds: ["3"],
          },
        ],
      }

      expect(actual).toEqual(expected)
    })

    it("rejects when a node id is 'null'", () => {
      const nodeList: NodeList = [
        {
          nodeId: "null",
          name: "Two",
          parentId: null,
          previousSiblingId: null,
        },
      ]

      const actual = buildNodeTree(nodeList)

      const expected: OperationResult<NodeTree[], TreeBuildFailures> = {
        result: "error",
        errors: [
          {
            type: TreeBuildFailureReasons.nodeHasNullAsId,
          },
        ],
      }

      expect(actual).toEqual(expected)
    })
  })
})
