import { getEnv } from "@utils/getEnv.ts"

export const CONFIGS = {
  ENCRYPTION: {
    KEY: getEnv("ENCRYPTION_KEY") || ""
  },
  IV: {
    KEY: getEnv("IV_LENGTH")
  },
  URI: {
    KEY: getEnv("MONGO_URI")
  },
  PORT: {
    KEY: getEnv("PORT_BACKEND", "3000")
  },
  TOKEN_SECRET: {
    KEY: getEnv("TOKEN_SECRET")
  }
}
export const GITHUB_CONFIG = {
  GITHUB_TOKEN: {
    KEY: getEnv("GITHUB_BOT_ACCES_TOKEN")
  },
  GITHUB_OWNER: {
    KEY: getEnv("GITHUB_OWNER")
  },
  GITHUB_REPO: {
    KEY: getEnv("GITHUB_REPO")
  },
  GITHUB_BOT_NAME: {
    KEY: getEnv("GITHUB_BOT_NAME")
  }
}

const CRYPTO_CONFIG = {
  development: {
    algorithm: getEnv("CRYPTO_DEV"),
    keyLength: parseInt(getEnv("KEY_LENGTH_DEV"))
  },
  test: {
    algorithm: getEnv("CRYPTO_TEST"),
    keyLength: parseInt(getEnv("KEY_LENGTH_TEST"))
  },
  production: {
    algorithm: getEnv("CRYPTO_PROD"),
    keyLength: parseInt(getEnv("KEY_LENGTH_PROD"))
  }
}

export const MEDIATYPE = ["TEXT", "VIDEO", "IMAGE"]
export const STATUS = ["DRAFT", "PENDING", "PUBLISHED"]

type Environment = "development" | "production"
const ENV = (process.env.NODE_ENV || "development") as Environment
export const CRYPTO = CRYPTO_CONFIG[ENV]
