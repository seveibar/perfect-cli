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
  // Get all boolean args
  const booleanArgs: string[] = []
  const aliases: Record<string, string[]> = {}

  const subcommand = getCommandFromPath(program, argv.slice(2))

  if (subcommand) {
    for (const option of subcommand.options) {
      if (option.long && option.short) {
        aliases[option.long.replace(/^--/, "").replace(/^-/, "")] = [
          option.short.replace(/^--/, "").replace(/^-/, ""),
        ]
      }
      if (option.isBoolean()) {
        booleanArgs.push(
          ...[option.long!, option.short!]
            .filter(Boolean)
            .map((r) => r.replace(/^--/, "").replace(/^-/, ""))
        )
      }
    }
  }

  // Trim the executable and program path
  const passedArgs = minimist(argv.slice(2), {
    boolean: booleanArgs,
    alias: aliases,
    stopEarly: false,
  })

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

  if (!command) {
    console.log(`Command not found: "${commandPath.join(" ")}"`)
    process.exit(1)
  }

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
    ...commandPath.concat(options._ ?? []),
    ...(Object.entries(options)
      .filter((opt) => opt[0] !== "_")
      .flatMap(([optKey, optVal]) => [`--${optKey}`, optVal]) as string[]),
  ])
}
