import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"

const getCommandFromPath = (program: Command, commandPath: string[]) =>
  commandPath.reduce(
    (curr: Command, nextCommandName) =>
      curr.commands.find((c) => c.name() === nextCommandName)!,
    program
  )

export const figureOutCommandPath = async (
  program: Command,
  commandPath: string[]
) => {
  const currentCommand = getCommandFromPath(program, commandPath)

  if (currentCommand.commands.length === 0) {
    return commandPath
  }

  const { nextCommandName } = await prompts({
    type: "autocomplete",
    name: "nextCommandName",
    message: "Choose command",
    choices: currentCommand.commands.map((c) => ({
      title: `${[program.name(), ...commandPath, c.name()]
        .filter(Boolean)
        .join(" ")}`,
      value: c.name(),
      description: c.description(),
    })),
  })

  return figureOutCommandPath(program, commandPath.concat([nextCommandName]))
}

export const perfectCli = async (program: Command, argv: string[]) => {
  // Trim the executable and program path
  const args = minimist(argv.slice(2))

  const isYesMode = args.yes || args.y
  const isInteractiveMode = args.i || args.interactive
  const isHelpMode = args.help || args.h

  const commandPath = await figureOutCommandPath(program, args._)
  const command = getCommandFromPath(program, commandPath)
}
