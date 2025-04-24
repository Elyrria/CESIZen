// src/index.ts
import { setupGracefulShutdown } from "@server/gracefulShutDown.ts"
import { createServer } from "@server/server.ts"
import { CONFIGS } from "@configs/global.configs.ts"
import app from "@core/app.ts"

const server = createServer(app, CONFIGS.PORT.KEY || "3000")
server.listen(app.get("port"))

setupGracefulShutdown(server)
