import test from "ava"
import { Command } from "commander"
import {
  getAllCommandPaths,
  getAllLeafCommandPaths,
} from "../src/get-all-command-paths"

test("getAllCommandPaths and getAllLeafCommandPaths", async (t) => {
  const program = new Command()

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

  const allCommandPaths = getAllCommandPaths(program)
  t.deepEqual(allCommandPaths, [
    "packages",
    "packages list",
    "packages create",
    "packages get",
    "users",
    "users list",
    "long_test_command",
    "add",
  ])

  const allLeafCommandPaths = getAllLeafCommandPaths(program)
  t.deepEqual(allLeafCommandPaths, [
    "packages list",
    "packages create",
    "packages get",
    "users list",
    "long_test_command",
    "add",
  ])
})
