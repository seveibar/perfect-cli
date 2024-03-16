import { perfectCli } from "../src/index"
import { program } from "commander"

program.name("my-cli")

const packagesCmd = program
  .command("packages")
  .description("Functions for packages")

packagesCmd
  .command("list")
  .description("List all packages")
  .action(() => {})

packagesCmd
  .command("create")
  .requiredOption("-n, --name <name>")
  .option("-d, --description <description>")
  .action(() => {})

packagesCmd
  .command("get")
  .option("-n, --name <name>", "Package name")
  .option("-i, --id <id>", "Package Id")
  .option("--sha <sha>", "Package Commit SHA")
  .description("Get a single package")
  .action((args) => {
    console.log("packages get invoked!", args)
  })

const usersCmd = program.command("users").description("Functions for users")

usersCmd
  .command("list")
  .description("List all users")
  .action(() => {})

const longTestCommand = program
  .command("long_test_command")
  .description("Long test command")

const positionalCmd = program
  .command("add")
  .argument("<packages...", "Packages to add")
  .action((args) => {
    console.log("add invoked!", args)
  })

perfectCli(program, process.argv, {
  async customParamHandler({ commandPath, optionName }, { prompts }) {
    if (commandPath[0] === "packages" && optionName === "id") {
      return (
        await prompts({
          type: "select",
          name: "id",
          choices: [
            {
              title: "Package 1",
              value: "1",
            },
            {
              title: "Package 2",
              value: "2",
            },
          ],
          message: "Select the package ID",
        })
      ).id
    }
  },
})
