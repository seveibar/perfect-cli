import { Command } from "commander"
import { getOptionKey } from "./figure-out-command-args"
import {
  getCommandFromPath,
  getPositionalArgsOnly,
} from "./get-command-from-path"

/**
 * Check if Commander program has all required arguments and options to run
 *
 * 1. Check that command is exhaustive (there are no subcommands)
 * 2. Check that all required positional arguments are present
 * 3. Check that all required options are present
 */
export const doesProgramHaveAllRequiredArgs = (
  program: Command,
  _: string[],
  passedArgs: Record<string, string>
) => {
  const command = getCommandFromPath(program, _)

  if (!command) {
    throw new Error(
      `Could not determine command from given positional args: ${JSON.stringify(
        _
      )}`
    )
  }

  const hasRequiredOptions = command.options
    .filter((o) => o.mandatory)
    .every((o) => passedArgs[getOptionKey(o)])

  const positionalArgs = getPositionalArgsOnly(program, _)
  const hasRequiredPositionalArgs = command.registeredArguments.every(
    (ra, i) => !ra.required || positionalArgs[i]
  )

  const hasSubcommands = command.commands.length > 0

  return !hasSubcommands && hasRequiredOptions && hasRequiredPositionalArgs
}
