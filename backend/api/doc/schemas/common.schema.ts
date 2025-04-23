/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         data:
 *           type: object
 *           description: Response data
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *               description: Error message describing what went wrong
 *             location:
 *               type: string
 *               description: Location where the error occurred (optional)
 *             errors:
 *               type: array
 *               description: List of detailed errors (optional)
 *               items:
 *                 type: object
 */
