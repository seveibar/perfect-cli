import type { Command } from "commander"
import { getAllLeafCommandPaths } from "./get-all-command-paths"

export const getCommandFromPath = (
  program: Command,
  commandPathAndPositionalArgs: string[]
) => {
  const commandPath = getCommandPathOnly(program, commandPathAndPositionalArgs)

  return commandPath.reduce(
    (curr: Command, nextCommandName) =>
      !curr
        ? (null as any)
        : curr.commands.find((c) => c.name() === nextCommandName)!,
    program
  )
}

export const getCommandPathOnly = (
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
  return commandPath
}

export const getPositionalArgsOnly = (
  program: Command,
  commandPathAndPositionalArgs: string[]
) => {
  const allLeafCommandPaths = getAllLeafCommandPaths(program)

  // Remove and positional args beyond the command path
  const commandPath = []
  let positionalArgs: string[] = []
  for (const elm of commandPathAndPositionalArgs) {
    commandPath.push(elm)
    if (allLeafCommandPaths.includes(commandPath.join(" "))) {
      positionalArgs = commandPathAndPositionalArgs.slice(commandPath.length)
      break
    }
  }
  return positionalArgs
}
