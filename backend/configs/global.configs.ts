import dotenv from "dotenv"

dotenv.config() // Load variables .env

const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue
	if (!value) throw new Error(`Missing env variable: ${key}`)
	return value
}

export const CONFIGS = {
	ENCRYPTION: {
		KEY: getEnv("ENCRYPTION_KEY") || "",
	},
	IV: {
		KEY: getEnv("IV_LENGTH"),
	},
	URI: {
		KEY: getEnv("MONGO_URI"),
	},
	PORT: {
		KEY: getEnv("PORT_BACKEND", "3000"),
	},
	TOKEN_SECRET: {
		KEY: getEnv("TOKEN_SECRET"),
	},
}
