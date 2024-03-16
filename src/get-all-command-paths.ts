import { Command } from "commander"

/**
 * Returns all possible command paths
 */
export const getAllCommandPaths = (program: Command) => {
  const allCommandPaths: string[] = []

  const traverse = (command: Command, currentPath: string[]) => {
    allCommandPaths.push(currentPath.join(" "))

    command.commands.forEach((subcommand) => {
      traverse(subcommand, [...currentPath, subcommand.name()])
    })
  }

  traverse(program, [])

  return allCommandPaths.filter((path) => path !== "")
}

export const getAllLeafCommandPaths = (program: Command) => {
  const allCommandPaths: string[] = []

  const traverse = (command: Command, currentPath: string[]) => {
    if (command.commands.length === 0) {
      allCommandPaths.push(currentPath.join(" "))
    }

    command.commands.forEach((subcommand) => {
      traverse(subcommand, [...currentPath, subcommand.name()])
    })
  }

  traverse(program, [])

  return allCommandPaths.filter((path) => path !== "")
}
