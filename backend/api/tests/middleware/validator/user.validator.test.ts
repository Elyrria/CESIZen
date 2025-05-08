import { createUserValidationRules } from "@validator/user.validator.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { validationResult } from "express-validator"
import { ROLES } from "@configs/role.configs.ts"
interface ValidationErrorWithPath {
	type: string
	value: any
	msg: string
	path: string
	location: string
}

describe("User Validation Rules", () => {
	// Use any to avoid typing issues
	const runValidation = async (body: any) => {
		const req: any = { body }
		const res: any = {}
		const next = jest.fn()

		// Execute each validation rule
		for (const rule of createUserValidationRules) {
			await Promise.resolve(rule(req, res, next))
		}

		return validationResult(req)
	}

	// Valid user data for tests
	const validUserData = {
		email: "test@example.com",
		password: "Password123!",
		name: "Doe",
		firstName: "John",
		birthDate: "1990-01-01", // ISO8601 format
		role: ROLES.REGISTERED_USER,
	}

	it("should pass validation with valid user data", async () => {
		const result = await runValidation(validUserData)
		expect(result.isEmpty()).toBe(true)
	})

	it("should fail validation with invalid email", async () => {
		const result = await runValidation({
			...validUserData,
			email: "invalid-email",
		})

		expect(result.isEmpty()).toBe(false)

		const errors = result.array() as unknown as ValidationErrorWithPath[]
		// Verify that the error is related to the email
		const emailError = errors.find((error) => error.path === FIELD.EMAIL)
		expect(emailError).toBeDefined()
		expect(emailError?.msg).toContain(FIELD.EMAIL)
	})

	it("should fail validation with password too short", async () => {
		const result = await runValidation({
			...validUserData,
			password: "Ps1!", // Too short
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const passwordError = errors.find((error) => error.path === FIELD.PASSWORD)
		expect(passwordError).toBeDefined()
	})

	it("should fail validation with password without special characters", async () => {
		const result = await runValidation({
			...validUserData,
			password: "Password123", // Without special character
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const passwordError = errors.find((error) => error.path === FIELD.PASSWORD)
		expect(passwordError).toBeDefined()
	})

	it("should fail validation with name too long", async () => {
		const result = await runValidation({
			...validUserData,
			name: "A".repeat(CONFIG_FIELD.LENGTH.NAME.MAX + 1),
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const nameError = errors.find((error) => error.path === FIELD.NAME)
		expect(nameError).toBeDefined()
	})

	it("should fail validation with birth date in the future", async () => {
		const futureDate = new Date()
		futureDate.setFullYear(futureDate.getFullYear() + 1)

		const result = await runValidation({
			...validUserData,
			birthDate: futureDate.toISOString().split("T")[0], // ISO8601 format (YYYY-MM-DD)
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const birthDateError = errors.find((error) => error.path === FIELD.BIRTH_DATE)
		expect(birthDateError).toBeDefined()
	})

	it("should fail validation with user too young", async () => {
		const tooYoungDate = new Date()
		tooYoungDate.setFullYear(tooYoungDate.getFullYear() - CONFIG_FIELD.MIN_AGE + 1)

		const result = await runValidation({
			...validUserData,
			birthDate: tooYoungDate.toISOString().split("T")[0],
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const birthDateError = errors.find((error) => error.path === FIELD.BIRTH_DATE)
		expect(birthDateError).toBeDefined()
	})

	it("should fail validation with unauthorized role", async () => {
		const result = await runValidation({
			...validUserData,
			role: ROLES.ADMIN, // Unauthorized role for creation
		})

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const roleError = errors.find((error) => error.path === FIELD.ROLE)
		expect(roleError).toBeDefined()
	})

	it("should fail validation for missing required fields", async () => {
		// Create an object without email
		const { email, ...missingEmailData } = validUserData

		const result = await runValidation(missingEmailData)

		expect(result.isEmpty()).toBe(false)
		const errors = result.array() as unknown as ValidationErrorWithPath[]

		const emailError = errors.find((error) => error.path === FIELD.EMAIL)
		expect(emailError).toBeDefined()
	})
})
