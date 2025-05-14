import { getInformations } from "@controllers/index.ts"
import { Router } from "express"

const getInformationsRouter = Router()

getInformationsRouter.get("/get-informations", getInformations)

export default getInformationsRouter
