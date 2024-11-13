import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // Use ts-jest preset for handling TypeScript
  testEnvironment: "node", // Use Node.js environment for server-side tests
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"], // Allow .ts, .tsx, .js, .json extensions
  testMatch: ["**/src/tests/**/*.(spec|test).[tj]s?(x)"], // Match test files with .test.ts or .spec.ts extension
};

export default config;
