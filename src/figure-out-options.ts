import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { getCommandFromPath } from "./get-command-from-path"

export const stringifyOptions = (options: Record<string, any>) =>
  Object.entries(options)
    .map(([key, value]) => `--${key} ${value}`)
    .join(" ")

export const figureOutCommandArgs = async (
  program: Command,
  commandPath: string[],
  options: Record<string, any>
) => {
  const command = getCommandFromPath(program, commandPath)

  console.log(
    `> ${[program.name(), ...commandPath]
      .filter(Boolean)
      .join(" ")} ${stringifyOptions(options)}`
  )
  const { optionToEdit } = await prompts({
    type: "autocomplete",
    name: "optionToEdit",
    message: "Choose option to edit",
    suggest: async (input, choices) =>
      choices.filter(
        (c) =>
          c.title.startsWith(input) ||
          c.title.replace(/^--/, "").startsWith(input)
      ),
    choices: [
      {
        title: "[Done]",
        value: "done",
        description: "Done editing options",
      },
      ...command.options.map((o) => {
        const optionName = (o.long! ?? o.short!).replace(/^--/, "")
        return {
          title: o.long!,
          value: optionName,
          description: options[optionName]
            ? `[${options[optionName]}]`
            : o.description,
        }
      }),
    ],
  })

  console.log({ optionToEdit })
}
