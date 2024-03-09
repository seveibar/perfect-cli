import prompts from "prompts"

export type PerfectCliOptions = {
  customParamHandlers?: (
    option: {
      commandPath: string[]
      optionName: string
    },
    ctx: { prompts: typeof prompts }
  ) => Promise<string | null | void>
}
