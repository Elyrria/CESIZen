// src/index.ts
import { setupGracefulShutdown } from "@server/gracefulShutDown.ts"
import { createServer } from "@server/server.ts"
import { PORT_BACKEND } from "@configs/configs.ts"
import app from "@core/app.ts"

const server = createServer(app, PORT_BACKEND || "3000")
server.listen(app.get("port"))

setupGracefulShutdown(server)
