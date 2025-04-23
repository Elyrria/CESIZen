/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's last name
 *         firstName:
 *           type: string
 *           description: User's first name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User's birth date
 *         role:
 *           type: string
 *           description: User's role in the system
 *           enum: [user, admin]
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
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *         name:
 *           type: string
 *         firstName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *
 *     CreateUserSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiSuccessResponse'
 *         - type: object
 *           properties:
 *             code:
 *               example: userCreated
 *             message:
 *               example: User created successfully
 *             data:
 *               $ref: '#/components/schemas/UserResponse'
 *
 *     ValidationErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiErrorResponse'
 *         - type: object
 *           properties:
 *             error:
 *               type: object
 *               properties:
 *                 code:
 *                   example: missingInfo
 *                 message:
 *                   example: Validation failed
 *                 location:
 *                   example: body
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: password
 *                       message:
 *                         type: string
 *                         example: The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character in @ $ ! % * ? &
 *                       location:
 *                         type: string
 *                         example: body
 *     ConflictErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiErrorResponse'
 *         - type: object
 *           properties:
 *             error:
 *               type: object
 *               properties:
 *                 code:
 *                   example: unableToCreateUser
 *                 message:
 *                   example: Unable to create an account with the provided information
 */
