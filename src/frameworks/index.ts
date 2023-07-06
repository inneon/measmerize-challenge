import { buildNodeTree } from "../application/build-node-tree"
import nodes from "./nodes.json"

export const main = () => {
  const tree = buildNodeTree(nodes)
  if (tree.result === "success") {
    console.log(tree.value)
  } else {
    const errors = tree.errors
    console.error(JSON.stringify(errors))
  }
}
