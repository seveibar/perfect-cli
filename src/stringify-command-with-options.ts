import { Command } from "commander"
import { getCommandFromPath } from "./get-command-from-path"
import { stringifyOptions } from "./stringify-options"

export const stringifyCommandWithOptions = (
  program: Command,
  commandPath: string[],
  options: Record<string, any>
) => {
  const command = getCommandFromPath(program, commandPath)

  return `${[program.name(), ...commandPath]
    .filter(Boolean)
    .join(" ")} ${stringifyOptions(options)}`
}
