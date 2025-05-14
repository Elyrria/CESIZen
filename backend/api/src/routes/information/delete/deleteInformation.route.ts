import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteInformation } from "@controllers/index.ts"
import { Router } from "express"

const deletInformation = Router()

deletInformation.delete("/delete/:id", auth, deleteInformation)

export default deletInformation
