import { Router } from "express"
// Import POST routes
import createTicketRouter from "@routes/support/post/createTicket.route.ts"

const router = Router()

router.use("/v1/support", createTicketRouter)

export default router
