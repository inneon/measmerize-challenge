import { buildNodeTree } from "../../application"
import { toHumanReadable } from "../failure-to-human-readable"
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
    console.error(tree.errors.map(toHumanReadable).join("\n"))
  }
}
