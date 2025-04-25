/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT token for API authentication
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTg3MiwiZXhwIjoxNzQ1NTY2NzcyfQ.-qmVEOhDihkviElT5Ls-EeIPP8KUfPVjdPL5szhWcSs"
 *         refreshToken:
 *           type: string
 *           description: Token to get a new accessToken when it expires
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTg3MiwiZXhwIjoxNzQ1NTY2NzcyfQ.-qmVEOhDihkviElT5Ls-EeIPP8KUfPVjdPL5szhWcSs"
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - userId
 *         - refreshToken
 *       properties:
 *         userId:
 *           type: string
 *           description: MongoDB ObjectID of the user
 *           example: "680b387ebb62a1b442d8a191"
 *         refreshToken:
 *           type: string
 *           description: The current refresh token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *       example:
 *         userId: "680b387ebb62a1b442d8a191"
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *
 *     RefreshTokenSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: tokenRenewed
 *         message:
 *           type: string
 *           example: New token generated
 *         data:
 *           type: object
 *           properties:
 *             tokens:
 *               $ref: '#/components/schemas/Tokens'
 *       example:
 *         success: true
 *         code: "tokenRenewed"
 *         message: "New token generated"
 *         data:
 *           tokens:
 *             accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTg3MiwiZXhwIjoxNzQ1NTY2NzcyfQ.-qmVEOhDihkviElT5Ls-EeIPP8KUfPVjdPL5szhWcSs"
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *
 *     TokenValidationErrorResponse:
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
 *               example: missingInfo
 *             message:
 *               type: string
 *               example: Validation failed
 *             location:
 *               type: string
 *               example: body
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     example: userId
 *                   message:
 *                     type: string
 *                     example: The refreshToken must be a valid format: MongoDB ObjectID
 *                   location:
 *                     type: string
 *                     example: body
 *       example:
 *         success: false
 *         error:
 *           code: "missingInfo"
 *           message: "Validation failed"
 *           location: "body"
 *           errors:
 *             - field: "userId"
 *               message: "The refreshToken must be a valid format: MongoDB ObjectID"
 *               location: "body"
 *
 *     UserMismatchErrorResponse:
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
 */
