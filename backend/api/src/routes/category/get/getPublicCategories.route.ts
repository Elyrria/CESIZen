import { getPublicCategories } from "@controllers/index.ts"
import { Router } from "express"

const getPublicCategoriesRouter = Router()

getPublicCategoriesRouter.get("/get-public-categories", getPublicCategories)

export default getPublicCategoriesRouter
