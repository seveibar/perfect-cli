import test from "ava"
import { Command } from "commander"
import { isInteractiveModeDisabled, perfectCli } from "../src/index"

test.beforeEach(() => {
  delete process.env.PERFECT_CLI_DISABLE_INTERACTIVE
  delete process.env.PERFECT_CLI_NO_INTERACTIVE
  delete process.env.PERFECT_CLI_INTERACTIVE
  delete process.env.CI
})

test.afterEach(() => {
  delete process.env.PERFECT_CLI_DISABLE_INTERACTIVE
  delete process.env.PERFECT_CLI_NO_INTERACTIVE
  delete process.env.PERFECT_CLI_INTERACTIVE
  delete process.env.CI
})

test("isInteractiveModeDisabled returns false by default", (t) => {
  t.false(isInteractiveModeDisabled())
})

test("isInteractiveModeDisabled detects PERFECT_CLI_DISABLE_INTERACTIVE", (t) => {
  process.env.PERFECT_CLI_DISABLE_INTERACTIVE = "true"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_DISABLE_INTERACTIVE = "1"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_DISABLE_INTERACTIVE = "false"
  t.false(isInteractiveModeDisabled())
})

test("isInteractiveModeDisabled detects PERFECT_CLI_NO_INTERACTIVE", (t) => {
  process.env.PERFECT_CLI_NO_INTERACTIVE = "true"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_NO_INTERACTIVE = "1"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_NO_INTERACTIVE = "0"
  t.false(isInteractiveModeDisabled())
})

test("isInteractiveModeDisabled detects PERFECT_CLI_INTERACTIVE=false or 0", (t) => {
  process.env.PERFECT_CLI_INTERACTIVE = "false"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_INTERACTIVE = "0"
  t.true(isInteractiveModeDisabled())

  process.env.PERFECT_CLI_INTERACTIVE = "true"
  t.false(isInteractiveModeDisabled())
})

test("isInteractiveModeDisabled detects CI environment", (t) => {
  process.env.CI = "true"
  t.true(isInteractiveModeDisabled())

  process.env.CI = "1"
  t.true(isInteractiveModeDisabled())

  process.env.CI = "false"
  t.false(isInteractiveModeDisabled())
})

test("perfectCli executes non-interactively when PERFECT_CLI_DISABLE_INTERACTIVE is set", async (t) => {
  process.env.PERFECT_CLI_DISABLE_INTERACTIVE = "true"
  process.env.NODE_ENV = "test"

  let executed = false
  let actionArgs: any = null

  const program = new Command()
  program.name("my-tool")
  program
    .command("deploy")
    .option("--env <environment>", "Target environment")
    .action((opts) => {
      executed = true
      actionArgs = opts
    })

  await perfectCli(program, ["node", "my-tool", "deploy", "--env", "production"])

  t.true(executed)
  t.is(actionArgs?.env, "production")
})

test("perfectCli executes non-interactively when options.disableInteractive is true", async (t) => {
  process.env.NODE_ENV = "test"

  let executed = false
  let actionArgs: any = null

  const program = new Command()
  program.name("my-tool")
  program
    .command("build")
    .option("--out <dir>", "Output dir")
    .action((opts) => {
      executed = true
      actionArgs = opts
    })

  await perfectCli(
    program,
    ["node", "my-tool", "build", "--out", "./dist"],
    { disableInteractive: true }
  )

  t.true(executed)
  t.is(actionArgs?.out, "./dist")
})
