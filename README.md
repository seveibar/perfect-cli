# Perfect CLI

Perfect CLI is a npm library for creating creating a CLI with the perfect
interaction model:

- By default, never error for an argument error
  - Go into interactive mode if there are any argument errors
- If `-y` is passed, run in non-interactive mode
- If `-i` is passed, run in interactive mode
- All commands and parameters can be configured and explored interactively
- By default, running the command without args is always interactive

## Usage

> Perfect CLI uses the same interface as [commander](https://www.npmjs.com/package/commander)

```ts
import { program } from "commander"


```