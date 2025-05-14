/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
	testEnvironment: "node", // Sets the test environment to Node.js
	setupFilesAfterEnv: ["./api/tests/setupTest.ts"], // Files to run after Jest is initialized but before tests are run - contains test setup like database connection
	setupFiles: ["./api/tests/mocks.ts"],
	collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"], // Specifies which files should be included in code coverage reports, excluding server.ts
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				useESM: true, // Important pour ESM
				// isolatedModules: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	roots: ["<rootDir>api/tests"], // Defines the root directories from where Jest should look for test files
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"], // Glob patterns that match test files - either in __tests__ folders or files ending with .spec.ts or .test.ts
	coverageDirectory: "coverage", // Directory where Jest should output coverage files
	testTimeout: 10000, // Maximum time in milliseconds that a test can run before Jest aborts it (10 seconds in this case)
	moduleNameMapper: {
		"^@mongoQueryBuilders/(.*)$": "<rootDir>/api/src/controllers/mongoQueryBuilders/$1",
		"^@successHandler/(.*)$": "<rootDir>/api/src/handlerResponse/successHandler/$1",
		"^@errorHandler/(.*)$": "<rootDir>/api/src/handlerResponse/errorHandler/$1",
		"^@sanitizers/(.*)$": "<rootDir>/api/src/middlewares/sanitizers/$1",
		"^@validator/(.*)$": "<rootDir>/api/src/middlewares/validator/$1",
		"^@controllers/(.*)$": "<rootDir>/api/src/controllers/$1",
		"^@middlewares/(.*)$": "<rootDir>/api/src/middlewares/$1",
		"^@services/(.*)$": "<rootDir>/api/src/services/$1",
		"^@models/(.*)$": "<rootDir>/api/src/models/$1",
		"^@server/(.*)$": "<rootDir>/api/src/server/$1",
		"^@routes/(.*)$": "<rootDir>/api/src/routes/$1",
		"^@utils/(.*)$": "<rootDir>/api/src/utils/$1",
		"^@logs/(.*)$": "<rootDir>/api/src/logs/$1",
		"^@core/(.*)$": "<rootDir>/api/src/core/$1",
		"^@configs/(.*)$": "<rootDir>/configs/$1",
		"^@api/(.*)$": "<rootDir>/api/$1",
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	testPathIgnorePatterns: ["/node_modules/"],
	transformIgnorePatterns: ["/node_modules/"],
}