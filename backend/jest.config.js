/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./api/tests/setupTest.ts"],
  setupFiles: ["./api/tests/mocks.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          target: "ESNext"
        }
      }
    ]
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/api/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  coverageDirectory: "coverage",
  testTimeout: 10000,
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
    "^@types/(.*)$": "<rootDir>/api/types/$1", // AJOUT MANQUANT
    "^@doc/(.*)$": "<rootDir>/api/doc/$1", // AJOUT MANQUANT
    "^@src/(.*)$": "<rootDir>/api/src/$1", // AJOUT MANQUANT
    "^@api/(.*)$": "<rootDir>/api/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"]
}
