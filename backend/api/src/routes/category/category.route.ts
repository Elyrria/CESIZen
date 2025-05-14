// Import POST routes
import createCategoryRouter from "@routes/category/post/createCategory.route.ts"
// Import PUT routes
// Import GET routes
// Import DELETE routes
import { Router } from "express"

const router = Router()
// POST routes
router.use("/v1/category", createCategoryRouter)
// GET routes
// DETLE routes
// PUT routes

export default router
