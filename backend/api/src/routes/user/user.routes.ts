import { Router } from "express"
// Import POST routes
import createUser from "@routes/user/post/createUser.route.ts"

// Import GET routes

// Import DELETE routes

// Import PUT routes

const router = Router()

router.use(createUser)

export default router