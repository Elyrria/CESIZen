import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { deleteUserById } from "@controllers/index.ts"
import { Router } from "express"

const getUsers = Router()

getUsers.delete("/delete/:id", auth, deleteUserById)

export default getUsers
