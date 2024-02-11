import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { figureOutCommandPath } from "./figure-out-command-path"
import { getCommandFromPath } from "./get-command-from-path"
import { figureOutCommandArgs } from "./figure-out-options"

export const perfectCli = async (program: Command, argv: string[]) => {
  // Trim the executable and program path
  const passedArgs = minimist(argv.slice(2))

  const { y, yes, i, interactive, h, help, _, ...unhandledPassedArgs } =
    passedArgs

  const isYesMode = yes || y
  const isInteractiveMode = i || interactive
  const isHelpMode = help || h

  const commandPath = await figureOutCommandPath(program, _)
  const command = getCommandFromPath(program, commandPath)

  const options = await figureOutCommandArgs(
    program,
    commandPath,
    unhandledPassedArgs
  )
}
