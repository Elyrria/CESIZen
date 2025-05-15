import { auth } from "@middlewares/security/auth.middleware.ts"
import { getAdminCategories } from "@controllers/index.ts"
import { Router } from "express"

const getAdminCategoriesRouter = Router()

getAdminCategoriesRouter.get("/get-categories", auth, getAdminCategories)

export default getAdminCategoriesRouter
