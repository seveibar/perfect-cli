module.exports = {
  files: ["tests/**/*.test.ts"],
  watchMode: {
    ignoreChanges: [".next", ".nsm"]
  },
  extensions: {
    ts: "commonjs"
  },
  nodeArguments: ["--import=tsx"]
}