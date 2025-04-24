import { createRefreshTokenValidationRules } from "@validator/refreshToken.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { refreshToken } from "@controllers/auth/refreshToken.controller.ts"
import { Router } from "express"
const createRefreshTokenRouter = Router()
// POST /api/v1/refresh-token/create
createRefreshTokenRouter.post("/create", createRefreshTokenValidationRules, validationErrorHandler, refreshToken)

export default createRefreshTokenRouter
