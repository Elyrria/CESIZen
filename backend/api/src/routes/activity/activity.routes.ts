// Import POST routes
import createActivityRouter from "@routes/activity/post/createActivity.route.ts"
// Import PUT routes
// Import GET routes
// Import DELETE routes
import { Router } from "express"

const router = Router()
// POST routes
router.use("/v1/activities", createActivityRouter)
// GET routes
// DETLE routes

// PUT routes

export default router
