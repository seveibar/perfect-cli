import { program } from "commander"

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

console.log(program.commands[0].name())
