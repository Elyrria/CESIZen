import { getPublicInformations } from "@controllers/index.ts"
import { Router } from "express"

const getPublicInformationsRouter = Router()

getPublicInformationsRouter.get("/get-public-informations", getPublicInformations)

export default getPublicInformationsRouter
