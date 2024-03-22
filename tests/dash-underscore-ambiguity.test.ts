import test from "ava"
import { Command } from "commander"
import {
  getAllCommandPaths,
  getAllLeafCommandPaths,
} from "../src/get-all-command-paths"
import { doesProgramHaveAllRequiredArgs } from "../src/does-program-have-all-required-args"

test("getAllCommandPaths and getAllLeafCommandPaths", async (t) => {
  const program = new Command()

  program.name("my-cli")

  const packagesCmd = program
    .command("my-packages")
    .description("Functions for packages")

  packagesCmd
    .command("list-all")
    .description("List all packages")
    .action(() => {})

  t.deepEqual(getAllLeafCommandPaths(program), ["my-packages list-all"])

  t.truthy(
    doesProgramHaveAllRequiredArgs(program, ["my_packages", "list_all"], {})
  )
})
