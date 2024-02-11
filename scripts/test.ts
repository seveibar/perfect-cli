import { perfectCli } from "../src/index"
import { program } from "commander"

program.name("perfect")

const packagesCmd = program
  .command("packages")
  .description("Functions for packages")

packagesCmd
  .command("list")
  .description("List all packages")
  .action((args) => {
    console.log("packages list invoked!", args)
  })

packagesCmd
  .command("get")
  .option("-n, --name <name>", "Package name")
  .option("-i, --id <id>", "Package Id")
  .option("--sha <sha>", "Package Commit SHA")
  .description("Get a single package")
  .action((args) => {
    console.log("packages get invoked!", args)
  })

const users = program.command("users").description("Functions for users")

users
  .command("list")
  .description("List all users")
  .action((args) => {
    console.log("users list invoked!", args)
  })

users
  .command("get")
  .option("-i, --id <id>", "User id")
  .description("Get user by id")
  .action((args) => {
    console.log("users get invoked!", args)
  })

console.log(perfectCli(program, process.argv))
