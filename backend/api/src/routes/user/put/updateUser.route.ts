import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { updateUserValidationRules } from "@validator/user.validator.ts"
import { updateUser } from "@controllers/index.ts"
import { Router } from "express"

const updateUserRouter = Router()
/**
 * @swagger
 * /api/v1/users/update/{id}:
 *   put:
 *     summary: Update a user profile
 *     description: Updates a user's information based on the provided ID. Different permissions apply based on the authenticated user's role and whether they are updating their own profile or another user's profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the user to update
 *         example: "6822343a752200c8b6659fac"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email address
 *               name:
 *                 type: string
 *                 description: Updated last name
 *               firstName:
 *                 type: string
 *                 description: Updated first name
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Updated birth date in ISO8601 format
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password (required for password change)
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (must be provided with current password)
 *               role:
 *                 type: string
 *                 description: Updated role (only available for admins)
 *                 enum: [user, administrator]
 *           examples:
 *             updateBasicInfo:
 *               summary: Update basic user information
 *               value:
 *                 name: "Jane"
 *                 firstName: "Doe"
 *                 email: "janedoe@gmail.com"
 *             updatePassword:
 *               summary: Update user password
 *               value:
 *                 password: "OldPassword123!"
 *                 newPassword: "NewPassword456!"
 *             adminUpdateRole:
 *               summary: Admin updating user's role
 *               value:
 *                 role: "administrator"
 *     responses:
 *       200:
 *         description: User successfully updated
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
 *                   example: userUpdated
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     birthDate:
 *                       type: string
 *                       format: date-time
 *                     active:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: number
 *                     id:
 *                       type: string
 *             example:
 *               success: true
 *               code: "userUpdated"
 *               message: "User updated successfully"
 *               data:
 *                 email: "janedoe@gmail.com"
 *                 name: "Jane"
 *                 firstName: "Doe"
 *                 role: "user"
 *                 birthDate: "1994-06-14T00:00:00.000Z"
 *                 active: true
 *                 createdAt: "2025-05-12T17:47:38.280Z"
 *                 updatedAt: "2025-05-12T18:29:39.244Z"
 *                 __v: 0
 *                 id: "6822343a752200c8b6659fac"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: validationFailed
 *                         message:
 *                           type: string
 *                           example: Validation failed
 *                         location:
 *                           type: string
 *                           example: body
 *                         errors:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               field:
 *                                 type: string
 *                               message:
 *                                 type: string
 *                               location:
 *                                 type: string
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: noFields
 *                         message:
 *                           type: string
 *                           example: No fields provided for update
 *             examples:
 *               validationError:
 *                 summary: Validation error - Invalid email format
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "email"
 *                         message: "The email must be a valid email address"
 *                         location: "body"
 *               noFieldsError:
 *                 summary: No fields provided for update
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "noFields"
 *                     message: "No fields provided for update"
 *       401:
 *         description: Unauthorized - Invalid password
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
 *                       example: invalidCredentials
 *                     message:
 *                       type: string
 *                       example: Incorrect username/password!
 *                     location:
 *                       type: string
 *                       example: body
 *             example:
 *               success: false
 *               error:
 *                 code: "invalidCredentials"
 *                 message: "Incorrect username/password!"
 *                 location: "body"
 *       403:
 *         description: Forbidden - Invalid or expired token or insufficient privileges
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: expiredToken
 *                         message:
 *                           type: string
 *                           example: Token expired
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: insufficientAccess
 *                         message:
 *                           type: string
 *                           example: Insufficient access
 *             examples:
 *               tokenExpired:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "expiredToken"
 *                     message: "Token expired"
 *               insufficientAccess:
 *                 summary: User lacks required permissions
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "insufficientAccess"
 *                     message: "Insufficient access"
 *       404:
 *         description: User not found
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
 *                       example: userNotFound
 *                     message:
 *                       type: string
 *                       example: User not found
 *             example:
 *               success: false
 *               error:
 *                 code: "userNotFound"
 *                 message: "User not found"
 *       409:
 *         description: Conflict - Email already exists
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
 *                       example: unableToCreateUser
 *                     message:
 *                       type: string
 *                       example: Unable to modify an account with the provided information
 *             example:
 *               success: false
 *               error:
 *                 code: "unableToCreateUser"
 *                 message: "Unable to modify an account with the provided information"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
updateUserRouter.put("/update/:id", updateUserValidationRules, validationErrorHandler, auth, updateUser)

export default updateUserRouter
