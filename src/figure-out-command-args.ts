import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { getCommandFromPath } from "./get-command-from-path"
import { stringifyOptions } from "./stringify-options"
import { PerfectCliOptions } from "./perfect-cli-options"

const getOptionKey = (o: { long?: string; short?: string }) =>
  (o.long! ?? o.short!).replace(/^--/, "")

export const figureOutCommandArgs = async (
  program: Command,
  commandPath: string[],
  options: Record<string, any>,
  perfectCliOptions?: PerfectCliOptions
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

  const hasRequiredOptions = command.options
    .filter((o) => o.mandatory)
    .every((o) => options[getOptionKey(o)])

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
      hasRequiredOptions
        ? {
            title: "[Done]",
            value: "done",
            description: "Done editing options",
          }
        : null,
      ...command.options.map((o) => {
        const optionName = getOptionKey(o)
        return {
          title: `${o.long!}${o.mandatory ? "*" : ""}`,
          value: optionName,
          description: options[optionName]
            ? `[${options[optionName]}]`
            : o.description,
        }
      }),
    ].filter((elm): elm is Exclude<typeof elm, null> => Boolean(elm)),
  })

  if (optionToEdit === "done") {
    return options
  }

  const option = command.options.find((o) => getOptionKey(o) === optionToEdit)!

  const customValue = await perfectCliOptions?.customParamHandler?.(
    {
      commandPath,
      optionName: option.name(),
    },
    { prompts }
  )

  if (customValue) {
    options[optionToEdit] = customValue
  } else if (option.isBoolean()) {
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
    // option.defaultValueDescription
    const { newValue } = await prompts({
      type: "text",
      name: "newValue",
      message: `Enter new value for ${option.long!}`,
      initial: options[optionToEdit],
    })

    options[optionToEdit] = newValue
  }

  return figureOutCommandArgs(program, commandPath, options, perfectCliOptions)
}
