import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"

export const getCommandFromPath = (program: Command, commandPath: string[]) =>
  commandPath.reduce(
    (curr: Command, nextCommandName) =>
      curr.commands.find((c) => c.name() === nextCommandName)!,
    program
  )
