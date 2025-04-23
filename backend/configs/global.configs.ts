import dotenv from "dotenv"

dotenv.config() // Load variables .env

const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue
	if (!value) throw new Error(`Missing env variable: ${key}`)
	return value
}

export const MONGO_URI = getEnv("MONGO_URI")
export const PORT_BACKEND = getEnv("PORT_BACKEND", "3000")
