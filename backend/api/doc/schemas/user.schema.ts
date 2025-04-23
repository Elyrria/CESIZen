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
 *         refreshToken:
 *           type: string
 *           description: Token to get a new accessToken when it expires
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated user ID
 *         lastName:
 *           type: string
 *           description: User's last name
 *         firstName:
 *           type: string
 *           description: User's first name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User's birth date
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - lastName
 *         - firstName
 *         - birthDate
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *         lastName:
 *           type: string
 *         firstName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *
 *     CreateUserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             message:
 *               example: User successfully created
 *             data:
 *               type: object
 *               properties:
 *                 tokens:
 *                   $ref: '#/components/schemas/Tokens'
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 */
