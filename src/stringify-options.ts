export const stringifyOptions = (options: Record<string, any>) =>
  Object.entries(options)
    .map(([key, value]) => `--${key} ${value}`)
    .join(" ")
