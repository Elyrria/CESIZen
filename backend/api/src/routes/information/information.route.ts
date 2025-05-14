// Import POST routes
import createInformationRouter from "@routes/information/post/createInformation.route.ts"
// Import PUT routes
import updateInformatioNRouter from "@routes/information/put/updateInformation.route.ts"
// Import GET routes
import getInformationsRouter from "@routes/information/get/getInformations.route.ts"
import getPublicInformationsRouter from "./get/getPublicInformations.route.ts"
import getMediaByIdRouter from "@routes/information/get/getMediaById.route.ts"
// Import DELETE routes
import deleteInformationRouter from "@routes/information/delete/deleteInformation.route.ts"
import { Router } from "express"

const router = Router()
// POST routes
router.use("/v1/informations", createInformationRouter)
// GET routes
router.use("/v1/informations", getInformationsRouter, getMediaByIdRouter, getPublicInformationsRouter)
// DETLE routes
router.use("/v1/informations", deleteInformationRouter)
// PUT routes
router.use("/v1/informations", updateInformatioNRouter)

export default router
