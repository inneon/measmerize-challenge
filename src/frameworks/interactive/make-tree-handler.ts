import inquirer, { Answers } from "inquirer"
import { MenuItemHandler } from "."
import { buildNodeTree } from "../../application"
import { parseFileNameToNodes } from "../parse-string-to-nodes"

const makeTreeHandler = async (): Promise<Answers | void> => {
  const { fileLocation } = await inquirer.prompt({
    type: "input",
    name: "fileLocation",
    message: "What is the input file?",
  })

  const parseResult = parseFileNameToNodes(fileLocation)

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

export const makeTreeMenuItem: MenuItemHandler = {
  name: "Make a tree from a file",
  value: makeTreeHandler,
}
