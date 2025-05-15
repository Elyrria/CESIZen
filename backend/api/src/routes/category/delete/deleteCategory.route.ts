import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteCategory } from "@controllers/index.ts"
import { Router } from "express"

const deleteCategoryRouter = Router()

deleteCategoryRouter.delete("/delete/:id", auth, deleteCategory)

export default deleteCategoryRouter
