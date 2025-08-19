import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { createTicketValidationRules } from "@validator/support.validator.ts"
import { createTicket } from "@controllers/support/createTicket.controller.ts"
import { Router } from "express"

const createTicketRouter = Router()

/**
 * @swagger
 * /api/v1/support/create-ticket:
 *   post:
 *     summary: Creates a new support ticket and GitHub issue
 *     description: Allows users to report bugs through an integrated ticketing system that automatically creates GitHub issues for technical team tracking.
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - priority
 *               - title
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [bug]
 *                 description: Type of ticket (currently only bug reports)
 *                 example: "bug"
 *               priority:
 *                 type: string
 *                 enum: [P1-Critical, P2-High, P3-Medium, P4-Low]
 *                 description: Priority level of the ticket
 *                 example: "P2-High"
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 100
 *                 description: Brief title describing the issue
 *                 example: "Application crashes when submitting breathing exercise"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *                 description: Detailed description of the issue
 *                 example: "When I complete a breathing exercise and click the submit button, the application crashes and returns to the home screen. This happens consistently on Chrome browser version 91.0."
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 description: Optional email for follow-up (not required for anonymous reporting)
 *                 example: "user@example.com"
 *           example:
 *             type: "bug"
 *             priority: "P2-High"
 *             title: "Application crashes during breathing exercise submission"
 *             description: "When completing a breathing exercise and clicking submit, the app crashes consistently on Chrome v91. Steps to reproduce: 1) Start breathing exercise 2) Complete full cycle 3) Click submit button 4) App crashes and returns to home screen."
 *             userEmail: "user@example.com"
 *     responses:
 *       201:
 *         description: Ticket successfully created and GitHub issue generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: "ticketCreated"
 *                 message:
 *                   type: string
 *                   example: "Ticket de support créé avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticket:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "bug"
 *                         priority:
 *                           type: string
 *                           example: "P2-High"
 *                         title:
 *                           type: string
 *                           example: "Application crashes during breathing exercise submission"
 *                         description:
 *                           type: string
 *                           example: "When completing a breathing exercise..."
 *                         userEmail:
 *                           type: string
 *                           nullable: true
 *                           example: "user@example.com"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-19T14:30:25.123Z"
 *                     github:
 *                       type: object
 *                       properties:
 *                         issueNumber:
 *                           type: integer
 *                           example: 42
 *                         issueUrl:
 *                           type: string
 *                           format: uri
 *                           example: "https://github.com/owner/cesizen/issues/42"
 *                         issueId:
 *                           type: integer
 *                           example: 1234567890
 *             examples:
 *               successResponse:
 *                 summary: Ticket created successfully
 *                 value:
 *                   success: true
 *                   code: "ticketCreated"
 *                   message: "Ticket de support créé avec succès"
 *                   data:
 *                     ticket:
 *                       type: "bug"
 *                       priority: "P2-High"
 *                       title: "Application crashes during breathing exercise submission"
 *                       description: "When completing a breathing exercise and clicking submit, the app crashes consistently on Chrome v91."
 *                       userEmail: "user@example.com"
 *                       createdAt: "2025-08-19T14:30:25.123Z"
 *                     github:
 *                       issueNumber: 42
 *                       issueUrl: "https://github.com/owner/cesizen/issues/42"
 *                       issueId: 1234567890
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "missingInfo"
 *                     message:
 *                       type: string
 *                       example: "Validation failed"
 *                     location:
 *                       type: string
 *                       example: "body"
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                           message:
 *                             type: string
 *                           location:
 *                             type: string
 *             examples:
 *               priorityValidationError:
 *                 summary: Invalid priority value
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "priority"
 *                         message: "The priority must be one of the following: P1-Critical, P2-High, P3-Medium, P4-Low"
 *                         location: "body"
 *               titleLengthError:
 *                 summary: Title too short
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "title"
 *                         message: "The title must be between 10 and 100 characters"
 *                         location: "body"
 *               multipleValidationErrors:
 *                 summary: Multiple validation errors
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "type"
 *                         message: "The type must be one of the following: bug"
 *                         location: "body"
 *                       - field: "description"
 *                         message: "The description must be between 20 and 1000 characters"
 *                         location: "body"
 *       500:
 *         description: Server error - GitHub integration failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *             examples:
 *               githubConfigError:
 *                 summary: GitHub configuration missing
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "ticketCreationFailed"
 *                     message: "Impossible de créer le ticket de support"
 *                     details: "Configuration GitHub manquante. Vérifiez GITHUB_TOKEN, PROJECT_OWNER et REPO_NAME"
 *               githubApiError:
 *                 summary: GitHub API error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "ticketCreationFailed"
 *                     message: "Impossible de créer le ticket de support"
 *                     details: "GitHub API rate limit exceeded"
 *               unexpectedError:
 *                 summary: Generic server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "Une erreur inattendue s'est produite lors de la création du ticket"
 */
createTicketRouter.post(
  "/create-ticket",
  createTicketValidationRules,
  validationErrorHandler,
  createTicket
)

export default createTicketRouter
