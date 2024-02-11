import { perfectCli } from "../src/index"
import { program } from "commander"

program.name("perfect")

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
  .description("List all packages")
  .action(() => {})

const users = program.command("users").description("Functions for users")

users
  .command("list")
  .description("List all users")
  .action(() => {})

users
  .command("get")
  .option("-i, --id <id>", "User id")
  .description("Get user by id")
  .action(() => {})

console.log(perfectCli(program, process.argv))
