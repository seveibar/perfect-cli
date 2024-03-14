import { Command } from "commander"
import { getOptionKey } from "./figure-out-command-args"
import { getCommandFromPath } from "./get-command-from-path"

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

  const hasRequiredOptions = command.options
    .filter((o) => o.mandatory)
    .every((o) => passedArgs[getOptionKey(o)])

  const hasRequiredPositionalArgs = command.registeredArguments
    .filter((ra) => ra.required)
    .every((ra) => passedArgs[ra.name()])

  const hasSubcommands = command.commands.length > 0

  return !hasSubcommands && hasRequiredOptions && hasRequiredPositionalArgs
}
