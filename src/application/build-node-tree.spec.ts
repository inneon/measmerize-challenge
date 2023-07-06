import { NodeList, NodeTree, OperationResult } from "../domain"
import { buildNodeTree } from "./build-node-tree"
import {
  TreeBuildFailureReasons,
  TreeBuildFailures,
} from "./tree-build-failure-reasons"

describe("building a node tree", () => {
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
    it.todo("rejects when there is a loop in parent-child relationships")
    it.todo("rejects when there is a loop in siblings")
    it.todo("rejects when there two nodes have the same previous sibling")
    it.todo("rejects when there a parent previous-sibling is not valid")
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
    it.todo("rejects multiple problems and reports correctly")
  })
})
