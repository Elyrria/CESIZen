import { Router } from "express"
// Import POST routes
import adminCreateUseRouter from "@routes/user/post/adminCreateUser.route.ts"
import createUseRouter from "@routes/user/post/createUser.route.ts"
import logoutUseRouter from "@routes/user/post/logoutUser.route.ts"
import loginUseRouter from "@routes/user/post/loginUser.route.ts"
// Import GET routes
import getAllUsersRouter from "@routes/user/get/getAllUsers.route.ts"
// Import DELETE routes
import deleteUserByIdRouter from "@routes/user/delete/deleteUser.route.ts"
// Import PUT routes
import updateUserRouter from "@routes/user/put/updateUser.route.ts"

const router = Router()
// POST routes
router.use("/v1/users", createUseRouter, loginUseRouter, adminCreateUseRouter, logoutUseRouter)
// GET routes
router.use("/v1/users", getAllUsersRouter)
// DETLE routes
router.use("/v1/users", deleteUserByIdRouter)
// PUT routes
router.use("/v1/users", updateUserRouter)

export default router