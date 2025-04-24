// import { refreshTokenValidationRule } from "../middleware/validators/refreshTokenValidator.ts"
// import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { refreshToken } from "@controllers/auth/refreshToken.controller.ts"
import { Router } from "express"
const createRefreshTokenRouter = Router()
// POST /api/v1/refresh-token/create
createRefreshTokenRouter.post("/create", refreshToken)

export default createRefreshTokenRouter
