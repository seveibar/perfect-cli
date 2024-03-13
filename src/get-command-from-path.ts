import type { Command } from "commander"

export const getCommandFromPath = (program: Command, commandPath: string[]) =>
  commandPath.reduce(
    (curr: Command, nextCommandName) =>
      !curr
        ? (null as any)
        : curr.commands.find((c) => c.name() === nextCommandName)!,
    program
  )
