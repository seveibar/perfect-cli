import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { getCommandFromPath } from "./get-command-from-path"
import { stringifyOptions } from "./stringify-options"

export const figureOutCommandArgs = async (
  program: Command,
  commandPath: string[],
  options: Record<string, any>
): Promise<Record<string, any>> => {
  const command = getCommandFromPath(program, commandPath)

  if (command.options.length === 0) {
    return options
  }

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

  if (optionToEdit === "done") {
    return options
  }

  const option = command.options.find(
    (o) => (o.long! ?? o.short!).replace(/^--/, "") === optionToEdit
  )!

  // TODO enable perfectCli user to pass in ways override edit options

  if (option.isBoolean()) {
    const { newValue } = await prompts({
      type: "toggle",
      name: "newValue",
      message: `Toggle ${option.name()}`,
      initial: options[optionToEdit],
      active: "true",
      inactive: "false",
    })

    options[optionToEdit] = newValue
  } else {
    const { newValue } = await prompts({
      type: "text",
      name: "newValue",
      message: `Enter new value for ${option.long!}`,
      initial: options[optionToEdit],
    })

    options[optionToEdit] = newValue
  }

  return figureOutCommandArgs(program, commandPath, options)
}
