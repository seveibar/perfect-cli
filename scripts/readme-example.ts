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

perfectCli(program, process.argv)
