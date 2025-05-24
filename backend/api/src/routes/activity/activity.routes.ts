// Import POST routes
import createActivityRouter from "@routes/activity/post/createActivity.route.ts"
// Import PUT routes
import updateActivityRouter from "@routes/activity/put/updateActivity.route.ts"
// Import GET routes
import getActivitiesRouter from "@routes/activity/get/getActivities.route.ts"
import getPublicActivitiesRouter from "@routes/activity/get/getPublicActivities.route.ts"
import getPublicActivityRouter from "@routes/activity/get/getPublicActivityById.route.ts"
// Import DELETE routes
import deleteActivityRouter from "@routes/activity/delete/deleteActivity.route.ts"
import { Router } from "express"

const router = Router()
// PUT routes
router.use("/v1/activities", updateActivityRouter)
// POST routes
router.use("/v1/activities", createActivityRouter)
// GET routes
router.use("/v1/activities", getActivitiesRouter, getPublicActivitiesRouter, getPublicActivityRouter)
// DELETE routes
router.use("/v1/activities", deleteActivityRouter)

export default router