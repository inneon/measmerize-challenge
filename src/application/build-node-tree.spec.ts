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
  })
})
