import { createRefreshTokenValidationRules } from "@validator/refreshToken.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { refreshToken } from "@controllers/auth/refreshToken.controller.ts"
import { Router } from "express"
const createRefreshTokenRouter = Router()
// POST /api/v1/refresh-token/create
/**
 * @swagger
 * /api/v1/refresh-token:
 *   post:
 *     summary: Generates new access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *           example:
 *             userId: "680b387ebb62a1b442d8a191"
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *     responses:
 *       200:
 *         description: New tokens generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenSuccessResponse'
 *             examples:
 *               successResponse:
 *                 summary: Successfully refreshed tokens
 *                 value:
 *                   success: true
 *                   code: "tokenRenewed"
 *                   message: "New token generated"
 *                   data:
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTg3MiwiZXhwIjoxNzQ1NTY2NzcyfQ.-qmVEOhDihkviElT5Ls-EeIPP8KUfPVjdPL5szhWcSs"
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenValidationErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Validation errors
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "userId"
 *                         message: "The refreshToken must be a valid format: MongoDB ObjectID"
 *                         location: "body"
 *       401:
 *         description: User identity mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMismatchErrorResponse'
 *             examples:
 *               mismatchError:
 *                 summary: User mismatch
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "userMisMatch"
 *                     message: "User identity mismatch"
 *       403:
 *         description: Invalid refresh token
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
 *                       example: invalidToken
 *                     message:
 *                       type: string
 *                       example: Invalid or expired refresh token
 *             examples:
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidToken"
 *                     message: "Invalid or expired refresh token"
 */
createRefreshTokenRouter.post("/create", createRefreshTokenValidationRules, validationErrorHandler, refreshToken)

export default createRefreshTokenRouter
