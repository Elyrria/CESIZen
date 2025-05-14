import { getMediaById } from "@controllers/index.ts"
import { Router } from "express"

const getMediaByIdRouter = Router()

getMediaByIdRouter.get("/media/:id", getMediaById)

export default getMediaByIdRouter
