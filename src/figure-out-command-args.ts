import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import {
  getCommandFromPath,
  getPositionalArgsOnly,
} from "./get-command-from-path"
import { stringifyOptions } from "./stringify-options"
import { PerfectCliOptions } from "./perfect-cli-options"
import { get } from "http"

export const getOptionKey = (o: { long?: string; short?: string }) =>
  (o.long! ?? o.short!).replace(/^--/, "")

export const getOptionDisplayName = (o: { long?: string; short?: string }) =>
  [o.short, o.long].filter(Boolean).join(", ") || getOptionKey(o)

export const figureOutCommandArgs = async (
  program: Command,
  commandPath: string[],
  options: Record<string, any>,
  perfectCliOptions?: PerfectCliOptions
): Promise<Record<string, any>> => {
  const command = getCommandFromPath(program, commandPath)
  const positionalArgs =
    options._ ?? getPositionalArgsOnly(program, commandPath)

  const hasAllPositionalArgs = command.registeredArguments.every(
    (ra, i) => !ra.required || positionalArgs[i]
  )
  if (!hasAllPositionalArgs) {
    const nextPositionalArg = command.registeredArguments.find(
      (ra, i) => ra.required && !positionalArgs[i]
    )

    // TODO allow custom param handling
    const { positionalArgInteractResult } = await prompts({
      name: "positionalArgInteractResult",
      type: "text",
      message: `Enter ${nextPositionalArg?.name()}`,
    })

    if (positionalArgInteractResult === undefined) {
      throw new Error(`${nextPositionalArg?.name()} is required`)
    }

    return figureOutCommandArgs(
      program,
      commandPath,
      { ...options, _: positionalArgs.concat([positionalArgInteractResult]) },
      perfectCliOptions
    )
  }

  if (command.options.length === 0) {
    return options
  }

  console.log(
    `> ${[program.name(), ...commandPath]
      .filter(Boolean)
      .join(" ")} ${stringifyOptions(options, command)}`
  )

  const hasRequiredOptions = command.options
    .filter((o) => o.mandatory)
    .every((o) => getOptionKey(o) in options)

  const { optionToEdit } = await prompts({
    type: "autocomplete",
    name: "optionToEdit",
    message: "Choose option to edit",
    suggest: async (input, choices) => {
      const normalizedInput = input.toLowerCase()
      return choices.filter((c) =>
        `${c.title} ${c.value}`.toLowerCase().includes(normalizedInput)
      )
    },
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
          title: `${getOptionDisplayName(o)}${o.mandatory ? "*" : ""}`,
          value: optionName,
          description:
            optionName in options ? `[${options[optionName]}]` : o.description,
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
      message: `Toggle ${getOptionDisplayName(option)}`,
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
      message: `Enter new value for ${getOptionDisplayName(option)}`,
      initial: options[optionToEdit],
    })

    options[optionToEdit] = newValue
  }

  return figureOutCommandArgs(program, commandPath, options, perfectCliOptions)
}
