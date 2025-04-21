import { logger } from "@logs/logger.ts"
import chalk from "chalk"
import http from "http"
/**
 * Displays a stylized message when the server starts
 */
export function displayServerStartMessage(server: http.Server, port: string | number): void {
	const portEmot: Record<string, string> = {
		"0": "0️⃣",
		"1": "1️⃣",
		"2": "2️⃣",
		"3": "3️⃣",
		"4": "4️⃣",
		"5": "5️⃣",
		"6": "6️⃣",
		"7": "7️⃣",
		"8": "8️⃣",
		"9": "9️⃣",
	}

	const portSplit = port
		.toString()
		.split("")
		.map((digit) => portEmot[digit] || digit)
		.join("  ")

	const address = server.address()
	const bind = typeof address === "string" ? `pipe ${address}` : `port ${portSplit}`

	let serverUrl = ""
	if (address && typeof address !== "string") {
		const host = address.address === "::" || address.address === "0.0.0.0" ? "localhost" : address.address
		serverUrl = `http://${host}:${address.port}`
	}

	const startMessage = "Server " + chalk.green("start ") + "🛫"
	const listeningMessage = `Listening 👂 on ${bind}`
	const urlMessage = serverUrl ? `💻 Server ${chalk.blue("URL")} : ${chalk.cyan(serverUrl)}` : ""

	if (process.env.NODE_ENV === "test") {
		console.log(startMessage)
		console.log(listeningMessage)
		if (serverUrl) console.log(urlMessage)
	}

	logger.info(startMessage)
	logger.info(listeningMessage)
	if (serverUrl) logger.info(urlMessage)
}
