/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's last name
 *         firstName:
 *           type: string
 *           description: User's first name
 *         role:
 *           type: string
 *           description: User's role in the system
 *           enum: [user, admin]
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User's birth date
 *         active:
 *           type: boolean
 *           description: Whether the user account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Account last update timestamp
 *         __v:
 *           type: number
 *           description: MongoDB version key
 *         id:
 *           type: string
 *           description: MongoDB ObjectID of the user
 *       example:
 *         email: "johndoe@gmail.com"
 *         name: "Doe"
 *         firstName: "John"
 *         role: "user"
 *         birthDate: "1994-06-14"
 *         active: true
 *         createdAt: "2025-04-25T07:23:42.991Z"
 *         updatedAt: "2025-04-25T07:23:42.991Z"
 *         __v: 0
 *         id: "680b387ebb62a1b442d8a191"
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - firstName
 *         - birthDate
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address for the user account
 *         password:
 *           type: string
 *           format: password
 *           description: User password with security requirements
 *         name:
 *           type: string
 *           description: User's last name
 *         firstName:
 *           type: string
 *           description: User's first name
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User's birth date in ISO8601 format
 *         role:
 *           type: string
 *           description: User's role (default is 'user')
 *           enum: [user]
 *       example:
 *         email: "johndoe@gmail.com"
 *         password: "Password1!"
 *         name: "Doe"
 *         firstName: "John"
 *         birthDate: "1994-06-14"
 *
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
 *     CreateUserSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: userCreated
 *         message:
 *           type: string
 *           example: User created successfully
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserResponse'
 *             tokens:
 *               $ref: '#/components/schemas/Tokens'
 *       example:
 *         success: true
 *         code: "userCreated"
 *         message: "User created successfully"
 *         data:
 *           user:
 *             email: "johndoe@gmail.com"
 *             name: "Doe"
 *             firstName: "John"
 *             role: "user"
 *             birthDate: "1994-06-14"
 *             active: true
 *             createdAt: "2025-04-25T07:23:42.991Z"
 *             updatedAt: "2025-04-25T07:23:42.991Z"
 *             __v: 0
 *             id: "680b387ebb62a1b442d8a191"
 *           tokens:
 *             accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ1NTY2NzIzfQ.BP32l2ODTEmjQbj6Kj00nS6jCMmfmPB6izhxqcrVY5E"
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
 *
 *     UserCreationErrorResponse:
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
 *               example: unableToCreateUser
 *             message:
 *               type: string
 *               example: Unable to create an account with the provided information
 *       example:
 *         success: false
 *         error:
 *           code: "unableToCreateUser"
 *           message: "Unable to create an account with the provided information"
 *
 *     UserValidationErrorResponse:
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
 *                   message:
 *                     type: string
 *                   location:
 *                     type: string
 *                     example: body
 *       examples:
 *         roleValidationError:
 *           value:
 *             success: false
 *             error:
 *               code: "missingInfo"
 *               message: "Validation failed"
 *               location: "body"
 *               errors:
 *                 - field: "role"
 *                   message: "The role must be one of the following: user"
 *                   location: "body"
 *         multipleValidationErrors:
 *           value:
 *             success: false
 *             error:
 *               code: "missingInfo"
 *               message: "Validation failed"
 *               location: "body"
 *               errors:
 *                 - field: "email"
 *                   message: "The email must be a valid email address"
 *                   location: "body"
 *                 - field: "birthDate"
 *                   message: "The birthDate must be a valid date in ISO8601 format"
 *                   location: "body"
 *                 - field: "role"
 *                   message: "The role must be one of the following: user"
 *                   location: "body"
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
 *
 *     AdminCreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - firstName
 *         - birthDate
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address for the user account
 *         password:
 *           type: string
 *           format: password
 *           description: User password with security requirements
 *         name:
 *           type: string
 *           description: User's last name
 *         firstName:
 *           type: string
 *           description: User's first name
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User's birth date in ISO8601 format
 *         role:
 *           type: string
 *           description: User's role assigned by admin
 *           enum: [user, administrator]
 *       example:
 *         email: "johndoe@gmail.com"
 *         password: "Password1!"
 *         name: "Doe"
 *         firstName: "John"
 *         birthDate: "1994-06-14"
 *         role: "administrator"
 *
 *     AdminCreateUserSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: userCreated
 *         message:
 *           type: string
 *           example: User created successfully
 *         data:
 *           $ref: '#/components/schemas/UserResponse'
 *       example:
 *         success: true
 *         code: "userCreated"
 *         message: "User created successfully"
 *         data:
 *           email: "johndoe@gmail.com"
 *           name: "Doe"
 *           firstName: "John"
 *           role: "administrator"
 *           birthDate: "1994-06-14T00:00:00.000Z"
 *           active: true
 *           createdAt: "2025-05-12T12:14:04.066Z"
 *           updatedAt: "2025-05-12T12:14:04.066Z"
 *           __v: 0
 *           id: "6821e60c2ff890a6189d367b"
 *
 *     TokenExpiredErrorResponse:
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
 *               example: expiredToken
 *             message:
 *               type: string
 *               example: Token expired
 *       example:
 *         success: false
 *         error:
 *           code: "expiredToken"
 *           message: "Token expired"
 */
