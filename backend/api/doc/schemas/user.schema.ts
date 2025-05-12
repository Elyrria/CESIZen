/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token for API authorization
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token to obtain new access tokens
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3MDQ2Nzg5fQ.BLyVjzpQ0EX69y-J05OBEy1na0AmB9tPKtKOVFt7LWw"
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3NjUwNjg5fQ.HIdpLq4rKCsTYIreQjLoBEU68jrXDRLLASl2yiUf0R4"
 *
 *     LoginUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user account
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *       example:
 *         email: "johndoe@gmail.com"
 *         password: "Password1!"
 *
 *     LoginUserSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: usersFound
 *         message:
 *           type: string
 *           example: Users found
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserResponse'
 *             tokens:
 *               $ref: '#/components/schemas/Tokens'
 *       example:
 *         success: true
 *         code: "usersFound"
 *         message: "Users found"
 *         data:
 *           user:
 *             email: "johndoe@gmail.com"
 *             name: "Doe"
 *             firstName: "John"
 *             role: "user"
 *             birthDate: "1994-06-14T00:00:00.000Z"
 *             active: true
 *             createdAt: "2025-05-12T10:15:00.188Z"
 *             updatedAt: "2025-05-12T10:15:00.188Z"
 *             __v: 0
 *             id: "6821ca240b30e026b31367fb"
 *           tokens:
 *             accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3MDQ2Nzg5fQ.BLyVjzpQ0EX69y-J05OBEy1na0AmB9tPKtKOVFt7LWw"
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3NjUwNjg5fQ.HIdpLq4rKCsTYIreQjLoBEU68jrXDRLLASl2yiUf0R4"
 *
 *     LoginUserErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: userMisMatch
 *             message:
 *               type: string
 *               example: User identity mismatch
 *       example:
 *         success: false
 *         error:
 *           code: "userMisMatch"
 *           message: "User identity mismatch"
 *
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: unexpectedError
 *             message:
 *               type: string
 *               example: An unexpected error occurred
 *       example:
 *         success: false
 *         error:
 *           code: "unexpectedError"
 *           message: "An unexpected error occurred"
 */
