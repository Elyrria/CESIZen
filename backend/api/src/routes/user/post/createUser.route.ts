import { Router } from "express"

const router = Router()

/**
 * @swagger
 * /api/v1/users/create-user:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *               example:
 *                 error:
 *                   msg: "Validation failed"
 *                   location: "request body"
 *                   errors:
 *                     - param: "email"
 *                       msg: "Must be a valid email address"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *               example:
 *                 error:
 *                   msg: "An internal server error occurred"
 */
router.post("/v1/users/create", (req, res) => {
	res.set("Cache-Control", "no-store")
	res.status(200).json({ message: "API fonctionne correctement" })
})

export default router
