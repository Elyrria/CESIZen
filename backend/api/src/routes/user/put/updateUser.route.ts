import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { updateUserValidationRules } from "@validator/user.validator.ts"
import { updateUser } from "@controllers/index.ts"
import { Router } from "express"

const updateUserRouter = Router()

updateUserRouter.put("/update/:id", updateUserValidationRules, validationErrorHandler, auth, updateUser)

export default updateUserRouter
