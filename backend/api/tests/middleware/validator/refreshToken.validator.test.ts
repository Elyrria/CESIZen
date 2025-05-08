import { createRefreshTokenValidationRules } from "@validator/refreshToken.validator.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { validationResult } from "express-validator"
import { Types } from "mongoose"

interface ValidationErrorWithPath {
	type: string
	value: any
	msg: string
	path: string
	location: string
}

describe("RefreshToken Validation Rules", () => {
	// Use any to avoid typing issues
	const runValidation = async (body: any) => {
		const req: any = { body }
		const res: any = {}
		const next = jest.fn()

		// Execute each validation rule
		for (const rule of createRefreshTokenValidationRules) {
			await Promise.resolve(rule(req, res, next))
		}

		return validationResult(req)
	}

	// Valid refreshToken data for tests
	const validRefreshTokenData = {
		refreshToken: "valid-refresh-token-string",
		userId: new Types.ObjectId().toString(), // Valid MongoDB ObjectId as string
	}

	it("should pass validation with valid refreshToken data", async () => {
		const result = await runValidation(validRefreshTokenData)
		expect(result.isEmpty()).toBe(true)
	})

	it("should fail validation with missing refreshToken", async () => {
		const { refreshToken, ...missingRefreshTokenData } = validRefreshTokenData
		const result = await runValidation(missingRefreshTokenData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const refreshTokenError = errors.find((error) => error.path === FIELD.REFRESH_TOKEN)
		expect(refreshTokenError).toBeDefined()
	})

	it("should fail validation with non-string refreshToken", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			refreshToken: 12345, // Non-string value
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const refreshTokenError = errors.find((error) => error.path === FIELD.REFRESH_TOKEN)
		expect(refreshTokenError).toBeDefined()
	})

	it("should fail validation with missing userId", async () => {
		const { userId, ...missingUserIdData } = validRefreshTokenData
		const result = await runValidation(missingUserIdData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})

	it("should fail validation with non-string userId", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			userId: 12345, // Non-string value
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})

	it("should fail validation with invalid ObjectId format for userId", async () => {
		const result = await runValidation({
			...validRefreshTokenData,
			userId: "invalid-object-id-format", // Invalid ObjectId format
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const userIdError = errors.find((error) => error.path === FIELD.USER_ID)
		expect(userIdError).toBeDefined()
	})
})
