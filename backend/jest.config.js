/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
	testEnvironment: "node", // Sets the test environment to Node.js
	setupFilesAfterEnv: ["./api/tests/setupTest.ts"], // Files to run after Jest is initialized but before tests are run - contains test setup like database connection
	collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"], // Specifies which files should be included in code coverage reports, excluding server.ts
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	roots: ["<rootDir>api/tests"], // Defines the root directories from where Jest should look for test files
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"], // Glob patterns that match test files - either in __tests__ folders or files ending with .spec.ts or .test.ts
	coverageDirectory: "coverage", // Directory where Jest should output coverage files
	testTimeout: 10000, // Maximum time in milliseconds that a test can run before Jest aborts it (10 seconds in this case)
	moduleNameMapper: {
		"^@errorHandler/(.*)$": "<rootDir>/api/src/handlerResponse/errorHandler/$1",
		"^@models/(.*)$": "<rootDir>/api/src/models/$1",
		"^@server/(.*)$": "<rootDir>/api/src/server/$1",
		"^@utils/(.*)$": "<rootDir>/api/src/utils/$1",
		"^@configs/(.*)$": "<rootDir>/configs/$1",
		"^@api/(.*)$": "<rootDir>/api/$1",
	},
}