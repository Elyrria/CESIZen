import { updateInformationValidationRules } from "@validator/information.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"
import { auth } from "@middlewares/security/auth.middleware.ts"
import { updateInformation } from "@controllers/index.ts"
import { Router } from "express"

const updateInformationRouter = Router()

updateInformationRouter.put(
	"/update/:id",
    upload.single("file"),
	updateInformationValidationRules,
	validationErrorHandler,
	auth,
	updateInformation
)

export default updateInformationRouter
