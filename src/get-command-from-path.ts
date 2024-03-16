import type { Command } from "commander"
import { getAllLeafCommandPaths } from "./get-all-command-paths"

export const getCommandFromPath = (
  program: Command,
  commandPathAndPositionalArgs: string[]
) => {
  const allLeafCommandPaths = getAllLeafCommandPaths(program)

  // Remove and positional args beyond the command path
  const commandPath = []
  for (const elm of commandPathAndPositionalArgs) {
    commandPath.push(elm)
    if (allLeafCommandPaths.includes(commandPath.join(" "))) {
      break
    }
  }

  return commandPath.reduce(
    (curr: Command, nextCommandName) =>
      !curr
        ? (null as any)
        : curr.commands.find((c) => c.name() === nextCommandName)!,
    program
  )
}
