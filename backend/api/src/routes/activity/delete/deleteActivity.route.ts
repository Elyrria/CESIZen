import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteActivity } from "@controllers/index.ts"
import { Router } from "express"

const deleteActivityRouter = Router()

deleteActivityRouter.delete("/delete/:id", auth, deleteActivity)

export default deleteActivityRouter
