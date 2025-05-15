import { auth } from "@middlewares/security/auth.middleware.ts"
import { getActivities } from "@controllers/index.ts"
import { Router } from "express"

const getActivitiesRouter = Router()

getActivitiesRouter.get("/get-activities", auth, getActivities)

export default getActivitiesRouter
