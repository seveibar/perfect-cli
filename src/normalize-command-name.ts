export const normalizeCommandName = (s: string) =>
  s.replace(/_/g, "-").toLowerCase()
