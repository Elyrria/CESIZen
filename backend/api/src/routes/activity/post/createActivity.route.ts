import { createActivityValidationRules } from "@validator/activity.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"
import { createActivity } from "@controllers/index.ts"
import { Router } from "express"

const createActivityRouter = Router()

createActivityRouter.post(
	"/create",
	upload.single("file"),
	createActivityValidationRules,
	validationErrorHandler,
	auth,
	createActivity
)

export default createActivityRouter
