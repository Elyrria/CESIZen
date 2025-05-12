import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { adminCreateUserValidationRules } from "@validator/user.validator.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { adminCreateUser } from "@controllers/index.ts"
import { Router } from "express"
const createUseRouter = Router()

createUseRouter.post("/admin-create", auth, adminCreateUserValidationRules, validationErrorHandler, adminCreateUser)

export default createUseRouter
