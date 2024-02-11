import { Command } from "commander"
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
  // Currently, commander doesn't have a good way to check if a command is
  // exhaustive, because mutually exclusive options are specified as optional
  return false
}
