import { Command } from "commander"
import { findOptionByKey, getOptionFlagName } from "./utils"

export const stringifyOptions = (options: Record<string, any>, command: Command) => {
  const seenFlags = new Set<string>()
  return Object.entries(options)
    .filter((opt) => opt[0] !== "_")
    .map(([key, value]) => {
      const option = findOptionByKey(command, key)
      const flagName = getOptionFlagName(command, key)
      if (!flagName || seenFlags.has(flagName)) {
        return ""
      }
      seenFlags.add(flagName)

      if (option?.isBoolean?.()) {
        return value ? `--${flagName}` : ""
      }

      return `--${flagName} ${value}`
    })
    .filter(Boolean)
    .join(" ")
}
