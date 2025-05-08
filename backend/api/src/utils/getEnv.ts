import dotenv from "dotenv"

dotenv.config() // Load variables .env

export const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue
	if (!value) throw new Error(`Missing env variable: ${key}`)
	return value
}
