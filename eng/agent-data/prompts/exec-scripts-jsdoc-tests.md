# Prompt (saved for reuse)

In the jsr/exec-scripts module:

- Write JSDoc for all exported members.
- Generate tests.
- In tests, check whether a required executable is on PATH using `pathFinder.findExe`.
  - If the executable is not found, skip the test.
- Use `@frostyeti/assert` for assertions.
- Use `node:test` for writing tests.
  - Use the `test` method only.
  - Do not use `describe` or `it`.
