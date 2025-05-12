import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { createUserValidationRules } from "@validator/user.validator.ts"
import { auth } from "@middlewares/security/auth.middleware.ts"
import { loginUser } from "@controllers/index.ts"
import { Router } from "express"

const loginUseRouter = Router()

loginUseRouter.post("/login", auth, loginUser)

export default loginUseRouter
