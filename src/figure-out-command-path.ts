import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { getCommandFromPath } from "./get-command-from-path"

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
    suggest: async (input, choices) =>
      choices.filter(
        (c) =>
          c?.title?.startsWith(input) ||
          c?.title?.split(" ").pop()?.startsWith(input)
      ),
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
