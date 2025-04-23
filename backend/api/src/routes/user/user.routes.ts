import { Router } from "express"
// Import POST routes
import createUseRouter from "@routes/user/post/createUser.route.ts"

// Import GET routes

// Import DELETE routes

// Import PUT routes

const router = Router()

router.use("/v1/users", createUseRouter)

export default router