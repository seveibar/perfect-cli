import type { Command } from "commander"
import prompts from "prompts"
import minimist from "minimist"
import { figureOutCommandPath } from "./figure-out-command-path"
import { getCommandFromPath } from "./get-command-from-path"
import { figureOutCommandArgs } from "./figure-out-command-args"
import { stringifyCommandWithOptions } from "./stringify-command-with-options"
import { stringifyOptions } from "./stringify-options"
import { doesProgramHaveAllRequiredArgs } from "./does-program-have-all-required-args"
import { PerfectCliOptions } from "./perfect-cli-options"

export const perfectCli = async (
  program: Command,
  argv: string[],
  perfectCliOptions?: PerfectCliOptions
) => {
  // Trim the executable and program path
  const passedArgs = minimist(argv.slice(2))

  const { y, yes, i, interactive, h, help, _, ...unhandledPassedArgs } =
    passedArgs

  const isYesMode = yes || y
  const isInteractiveMode = i || interactive
  const isHelpMode = help || h

  const hasRequiredArgsToRun = doesProgramHaveAllRequiredArgs(
    program,
    _,
    passedArgs
  )

  const argvWithoutPerfect = argv.filter(
    (a) => !["--yes", "-y", "-i", "--interactive"].includes(a)
  )

  if (isYesMode || (!isInteractiveMode && hasRequiredArgsToRun)) {
    await program.parseAsync(argvWithoutPerfect)
    process.exit(0)
  }

  const commandPath = await figureOutCommandPath(program, _)
  const command = getCommandFromPath(program, commandPath)

  const options = await figureOutCommandArgs(
    program,
    commandPath,
    unhandledPassedArgs,
    perfectCliOptions
  )

  const fullCommandString = stringifyCommandWithOptions(
    program,
    commandPath,
    options
  )
  console.log(`> ${fullCommandString}`)

  await program.parseAsync([
    ...process.argv.slice(0, 2),
    ...commandPath,
    ...(Object.entries(options).flatMap(([optKey, optVal]) => [
      `--${optKey}`,
      optVal,
    ]) as string[]),
  ])
}
