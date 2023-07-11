import inquirer, { Answers } from "inquirer"
import { makeTreeMenuItem } from "./make-tree-handler"

export interface MenuItemHandler {
  name: string
  value(): Promise<Answers | void>
}

export const runInteractive = async () => {
  const mainMenuName = "Main menu"
  const answers = await inquirer.prompt({
    type: "list",
    name: mainMenuName,
    message: "What would you like to do?",
    choices: [makeTreeMenuItem, quitMenuItem],
  })
  try {
    await answers[mainMenuName]()
    console.info("\n")
  } catch (error) {
    console.error(`\t ${error}`)
  }
  await runInteractive()
}

const quitHandler = async (): Promise<Answers | void> => {
  process.exit(0)
}

const quitMenuItem: MenuItemHandler = {
  name: "Quit",
  value: quitHandler,
}
