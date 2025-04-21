// src/core/app.ts
import { setupSecurityMiddleware } from "@middlewares/security.ts"
import { morganMiddleware, errorLogger } from "@logs/logger.ts"
import { setupMongoConnection } from "@configs/db.ts"
import express from "express"

const app = express()

// Security configutration
setupSecurityMiddleware(app)


if (process.env.NODE_ENV !== "test") {
	app.use(morganMiddleware) // For request logging
}

// Connection to MongoDB
if (process.env.NODE_ENV !== "test") {
	setupMongoConnection()
}

// Global error middleware
app.use(errorLogger)

// Dans votre fichier de routes
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API fonctionne correctement' })
})

// Route par défaut pour la racine
app.get('/', (req, res) => {
  res.status(200).send('Serveur en ligne')
})

export default app
