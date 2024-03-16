export const stringifyOptions = (options: Record<string, any>) =>
  Object.entries(options)
    .filter((opt) => opt[0] !== "_")
    .map(([key, value]) => `--${key} ${value}`)
    .join(" ")
