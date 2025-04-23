/**
 * @swagger
 * components:
 *   schemas:
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *           description: Indicates failed operation
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
 */
