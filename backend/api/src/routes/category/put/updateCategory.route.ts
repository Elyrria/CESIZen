import { updateCategoryValidationRules } from "@validator/category.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { auth } from "@middlewares/security/auth.middleware.ts"
import { updateCategory } from "@controllers/index.ts"
import { Router } from "express"

const updateCategoryRouter = Router()

updateCategoryRouter.put("/update/:id", updateCategoryValidationRules, validationErrorHandler, auth, updateCategory)

export default updateCategoryRouter
