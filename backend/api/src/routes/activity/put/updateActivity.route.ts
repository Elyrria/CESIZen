import { auth } from "@middlewares/security/auth.middleware.ts"
import { updateActivity } from "@controllers/index.ts"
import { Router } from "express"

const updateActivityRouter = Router()

updateActivityRouter.put("/update/:id", auth, updateActivity)

export default updateActivityRouter
