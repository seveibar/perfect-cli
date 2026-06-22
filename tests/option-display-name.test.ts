import test from "ava"
import { Option } from "commander"
import { getOptionDisplayName } from "../src/figure-out-command-args"

test("getOptionDisplayName includes short and long flag aliases", (t) => {
    t.is(
        getOptionDisplayName(new Option("-n, --name <name>", "Package name")),
        "-n, --name"
    )
    t.is(
        getOptionDisplayName(new Option("-v, --verbose", "Verbose output")),
        "-v, --verbose"
    )
})

test("getOptionDisplayName handles options without aliases", (t) => {
    t.is(
        getOptionDisplayName(new Option("--commit-sha <sha>", "Commit SHA")),
        "--commit-sha"
    )
    t.is(getOptionDisplayName(new Option("-q", "Quiet")), "-q")
})
