import test from "ava"
import { Command } from "commander"
import { isNonInteractiveEnvEnabled, perfectCli } from "../src/index"

test("isNonInteractiveEnvEnabled detects truthy env values", (t) => {
    for (const value of ["1", "true", "TRUE", "yes", "on"]) {
        t.true(
            isNonInteractiveEnvEnabled({
                PERFECT_CLI_NON_INTERACTIVE: value,
            } as NodeJS.ProcessEnv)
        )
    }

    for (const value of ["", "0", "false", "off"]) {
        t.false(
            isNonInteractiveEnvEnabled({
                PERFECT_CLI_NON_INTERACTIVE: value,
            } as NodeJS.ProcessEnv)
        )
    }
})

test.serial(
    "PERFECT_CLI_NON_INTERACTIVE disables prompts for argument errors",
    async (t) => {
        const previousValue = process.env.PERFECT_CLI_NON_INTERACTIVE
        process.env.PERFECT_CLI_NON_INTERACTIVE = "1"

        const program = new Command()
        program.name("deploy-cli")
        program.exitOverride()
        program.configureOutput({
            writeErr: () => {},
            writeOut: () => {},
        })
        program
            .command("deploy")
            .requiredOption("--token <token>", "Deployment token")
            .action(() => {
                t.fail("command should not run without required options")
            })

        try {
            await t.throwsAsync(
                () => perfectCli(program, ["node", "deploy-cli", "deploy"]),
                {
                    message: /required option '--token <token>' not specified/,
                }
            )
        } finally {
            if (previousValue === undefined) {
                delete process.env.PERFECT_CLI_NON_INTERACTIVE
            } else {
                process.env.PERFECT_CLI_NON_INTERACTIVE = previousValue
            }
        }
    }
)
