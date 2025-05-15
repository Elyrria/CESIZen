import { getPublicActivities } from "@controllers/index.ts"
import { Router } from "express"

const getPublicActivitiesRouter = Router()

getPublicActivitiesRouter.get("/get-public-activities", getPublicActivities)

export default getPublicActivitiesRouter
