/**
 * @swagger
 * components:
 *   schemas:
 *     ApiSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates successful operation
 *           example: true
 *         code:
 *           type: string
 *           description: Operation-specific success code
 *         message:
 *           type: string
 *           description: Success message
 *         data:
 *           type: object
 *           description: Response data
 *       example:
 *         success: true
 *         code: "operationSuccessful"
 *         message: "Operation was successful"
 *         data: {}
 *
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates failed operation
 *           example: false
 *         error:
 *           type: object
 *           required:
 *             - code
 *             - message
 *           properties:
 *             code:
 *               type: string
 *               description: Error code identifying the type of error
 *             message:
 *               type: string
 *               description: Error message describing what went wrong
 *             location:
 *               type: string
 *               description: Location where the error occurred
 *             errors:
 *               type: array
 *               description: Optional list of validation errors
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     description: Field that failed validation
 *                   message:
 *                     type: string
 *                     description: Error message for this field
 *                   location:
 *                     type: string
 *                     description: Location of the field (e.g., body, query, params)
 *       example:
 *         success: false
 *         error:
 *           code: "genericError"
 *           message: "An error occurred during operation"
 */
