import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { loginUserValidationRules } from "@validator/user.validator.ts"
import { loginUser } from "@controllers/index.ts"
import { Router } from "express"

const loginUseRouter = Router()

loginUseRouter.post("/login", loginUserValidationRules, validationErrorHandler, loginUser)

export default loginUseRouter
