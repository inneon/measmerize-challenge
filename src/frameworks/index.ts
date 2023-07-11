import { singleRunFromFileName } from "./single-run"
import { Command, Option } from "commander"
import { runInteractive } from "./interactive"

interface ProgramArgs {
  file?: string
  interactive?: boolean
}

export const main = () => {
  const program = new Command()

  program
    .version("1.0.0")
    .description("Runnable wrapper for node-tree building code-challenge")
    .addOption(
      new Option(
        "-f, --file <value>",
        "Specifies the input file to read node definitions",
      ).default("./src/nodes.json"),
    )
    .addOption(
      new Option(
        "-i, --interactive",
        "Runs the program in interactive mode",
      ).conflicts("file"),
    )
    // More options could be added here for hosting the tree builder in a HTTP server, etc...
    .parse(process.argv)

  runProgramFromArgs(program.opts())
}

const runProgramFromArgs = ({ file, interactive }: ProgramArgs) => {
  if (interactive) {
    runInteractive()
    return
  }
  if (file) {
    singleRunFromFileName(file)
  }
}
