import { buildNodeTree } from "../../application"
import { parseFileNameToNodes } from "../parse-string-to-nodes"

export const singleRunFromFileName = (fileName: string) => {
  const parseResult = parseFileNameToNodes(fileName)
  if (parseResult instanceof Error) {
    console.log(JSON.stringify(parseResult))
    return
  }

  const tree = buildNodeTree(parseResult)
  if (tree.result === "success") {
    console.log(JSON.stringify(tree.value))
  } else {
    const errors = tree.errors
    console.error(JSON.stringify(errors))
  }
}
