import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { getAllUsers } from "@controllers/index.ts"
import { Router } from "express"

const getUsers = Router()

getUsers.get("/get-users", auth, getAllUsers)

export default getUsers
