import createInformationRouter from "@routes/information/post/createInformation.route.ts"
import { Router } from "express"
// Import POST routes

// Import GET routes
// Import DELETE routes
// Import PUT routes

const router = Router()
// POST routes
router.use("/v1/informations", createInformationRouter)
// GET routes
// DETLE routes
// PUT routes

export default router
