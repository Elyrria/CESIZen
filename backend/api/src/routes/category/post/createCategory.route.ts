import { auth } from "@middlewares/security/auth.middleware.ts"
import { createCategory } from "@controllers/index.ts"
import { Router } from "express"

const createCategoryRouter = Router()

createCategoryRouter.post("/create", auth, createCategory)

export default createCategoryRouter
