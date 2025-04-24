import { Router } from "express"
// Import POST routes
import crecreateRefreshTokenRouterateUseRouter from "@routes/refreshToken/post/createRefreshToken.routes.ts"
// Import GET routes
// Import DELETE routes
// Import PUT routes
const router = Router()

router.use("/v1/refresh-token", crecreateRefreshTokenRouterateUseRouter)

export default router
