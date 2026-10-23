import prompts from "prompts"

export type PerfectCliOptions = {
  interactive?: boolean
  disableInteractive?: boolean
  customParamHandler?: (
    option: {
      commandPath: string[]
      optionName: string
    },
    ctx: { prompts: typeof prompts }
  ) => Promise<string | null | void>
}
