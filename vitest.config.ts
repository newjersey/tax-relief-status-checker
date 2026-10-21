import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["webapp", "lambda", "lambda-missed-mailer-api"],
  },
});
