import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import GitHubService from "@api/src/services/github.service.ts"
import type { Request, Response } from "express"

/**
 * Interface pour la requête de création de ticket
 */
interface ICreateTicketRequest {
  type: string
  priority: string
  title: string
  description: string
  userEmail?: string
}

/**
 * Controller for creating support tickets and GitHub issues.
 *
 * This controller handles the process of creating support tickets by automatically
 * generating GitHub issues with proper labels and status for the technical team.
 * It integrates with the existing project dashboard for tracking and management.
 *
 * @param {Request} req - The request object containing ticket details in the body.
 * @param {Response} res - The response object to send the created ticket details or an error message.
 * @returns {Promise<void>} - A promise that resolves to the response object with ticket details or an error message.
 */
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract ticket details from the request body
    const ticketData: ICreateTicketRequest = req.body

    // Validate required fields are present
    if (!ticketData.type || !ticketData.priority || !ticketData.title || !ticketData.description) {
      errorHandler(res, ERROR_CODE.MISSING_INFO)
      return
    }

    // Initialize GitHub service with error handling
    let githubService: GitHubService

    try {
      githubService = new GitHubService()
    } catch (configError) {
      console.error("GitHub service configuration error:", configError)
      errorHandler(res, ERROR_CODE.SERVER)
      return
    }

    // Test GitHub connection before creating issue
    const isConnected = await githubService.testConnection()
    if (!isConnected) {
      console.error("GitHub API connection failed")
      errorHandler(res, ERROR_CODE.SERVER)
      return
    }

    // Create GitHub issue with proper labels for dashboard integration
    const issueResult = await githubService.createIssue({
      type: ticketData.type,
      priority: ticketData.priority,
      title: ticketData.title,
      description: ticketData.description,
      userEmail: ticketData.userEmail
    })

    if (!issueResult.success) {
      console.error("Failed to create GitHub issue")
      errorHandler(res, ERROR_CODE.SERVER)
      return
    }

    // Prepare response data - structure adaptée pour le frontend
    const responseData = {
      success: true,
      message: "Ticket créé avec succès",
      ticketId: `CESIZEN-${issueResult.issueNumber}`, // Format friendly pour l'utilisateur
      issueNumber: issueResult.issueNumber.toString(), // Numéro GitHub en string
      githubIssueUrl: issueResult.issueUrl,
      ticket: {
        type: ticketData.type,
        priority: ticketData.priority,
        title: ticketData.title,
        description: ticketData.description,
        userEmail: ticketData.userEmail || null,
        createdAt: new Date().toISOString(),
        status: "Backlog" // Initial status for dashboard
      },
      github: {
        issueNumber: issueResult.issueNumber,
        issueUrl: issueResult.issueUrl,
        issueId: issueResult.issueId
      }
    }

    // Return success response using your standard pattern
    createdHandler(res, SUCCESS_CODE.TICKET_CREATED, responseData)
  } catch (error) {
    handleUnexpectedError(res, error as Error)
  }
}
