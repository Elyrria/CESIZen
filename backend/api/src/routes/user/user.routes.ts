import { Router } from "express"
// Import POST routes
import adminCreateUseRouter from "@routes/user/post/adminCreateUser.route.ts"
import createUseRouter from "@routes/user/post/createUser.route.ts"
import loginUseRouter from "@routes/user/post/loginUser.route.ts"

// Import GET routes

// Import DELETE routes

// Import PUT routes

const router = Router()
// POST routes
router.use("/v1/users", createUseRouter, loginUseRouter, adminCreateUseRouter)

export default router