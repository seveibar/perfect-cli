import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { getCommandFromPath } from "./get-command-from-path"

export const figureOutCommandPath = async (
  program: Command,
  commandPath: string[]
): Promise<string[]> => {
  const currentCommand = getCommandFromPath(program, commandPath)

  if (currentCommand.commands.length === 0) {
    return commandPath
  }

  const normalizeText = (text: string) =>
    text.replace(/[-_ ]/g, "_").toLowerCase()

  const { nextCommandName } = await prompts({
    type: "autocomplete",
    name: "nextCommandName",
    message: "Choose command",
    suggest: async (input, choices) => {
      const normalizedInput = normalizeText(input)
      return choices.filter(
        (c) =>
          normalizeText(c?.title!).startsWith(normalizedInput) ||
          normalizeText(c?.title?.split(" ").pop()!)?.startsWith(
            normalizedInput
          )
      )
    },
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
