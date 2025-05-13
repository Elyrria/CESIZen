import { createInformationValidationRules } from "@validator/information.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import {upload} from "@middlewares/multer/upload.middleware.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { createInformation } from "@controllers/index.ts"
import { Router } from "express"

const createInformationRouter = Router()

createInformationRouter.post(
	"/create",
	upload.single("file"),
	createInformationValidationRules,
	validationErrorHandler,
	auth,
	createInformation
)

export default createInformationRouter
