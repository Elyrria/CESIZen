// Import POST routes
import createCategoryRouter from "@routes/category/post/createCategory.route.ts"
// Import PUT routes
import updateCategoryRouter from "@routes/category/put/updateCategory.route.ts"
// Import GET routes
import getAdminCategoriesRouter from "@routes/category/get/getAdminCategories.route.ts"
import getPublicCategoriesRouter from "@routes/category/get/getPublicCategories.route.ts"
// Import DELETE routes
import deleteCategoryRouter from "@routes/category/delete/deleteCategory.route.ts"
import { Router } from "express"

const router = Router()
// POST routes
router.use("/v1/category", createCategoryRouter)
// GET routes
router.use("/v1/category", getAdminCategoriesRouter)
router.use("/v1/category", getPublicCategoriesRouter)
// DETLE routes
router.use("/v1/category", deleteCategoryRouter)
// PUT routes
router.use("/v1/category", updateCategoryRouter)

export default router
