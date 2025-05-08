import { validateRequiredUserFields } from "@utils/validateRequiredFields.ts"
import type { IUserCreate } from "@api/types/user.d.ts"

describe("validateRequiredUserFields", () => {
	// Test for a valid user with all required fields
	it("should return true when all required fields are present", () => {
		const validUser: Partial<IUserCreate> = {
			role: "user",
			password: "Password123",
			email: "user@example.com",
			name: "Doe",
			firstName: "John",
			birthDate: new Date("1990-01-01"),
		}

		expect(validateRequiredUserFields(validUser)).toBe(true)
	})

	// Test for missing fields
	it("should return false when any required field is missing", () => {
		// Missing role
		expect(
			validateRequiredUserFields({
				password: "Password123",
				email: "user@example.com",
				name: "Doe",
				firstName: "John",
				birthDate: new Date("1990-01-01"),
			})
		).toBe(false)

		// Missing password
		expect(
			validateRequiredUserFields({
				role: "user",
				email: "user@example.com",
				name: "Doe",
				firstName: "John",
				birthDate: new Date("1990-01-01"),
			})
		).toBe(false)

		// Missing email
		expect(
			validateRequiredUserFields({
				role: "user",
				password: "Password123",
				name: "Doe",
				firstName: "John",
				birthDate: new Date("1990-01-01"),
			})
		).toBe(false)

		// Missing name
		expect(
			validateRequiredUserFields({
				role: "user",
				password: "Password123",
				email: "user@example.com",
				firstName: "John",
				birthDate: new Date("1990-01-01"),
			})
		).toBe(false)

		// Missing firstName
		expect(
			validateRequiredUserFields({
				role: "user",
				password: "Password123",
				email: "user@example.com",
				name: "Doe",
				birthDate: new Date("1990-01-01"),
			})
		).toBe(false)

		// Missing birthDate
		expect(
			validateRequiredUserFields({
				role: "user",
				password: "Password123",
				email: "user@example.com",
				name: "Doe",
				firstName: "John",
			})
		).toBe(false)
	})

	// Test for empty string values
	it("should return false when any required field is an empty string", () => {
		const userWithEmptyStrings: Partial<IUserCreate> = {
			role: "",
			password: "Password123",
			email: "user@example.com",
			name: "Doe",
			firstName: "John",
			birthDate: new Date("1990-01-01"),
		}

		expect(validateRequiredUserFields(userWithEmptyStrings)).toBe(false)
	})

	// Test for empty object
	it("should return false for an empty object", () => {
		expect(validateRequiredUserFields({})).toBe(false)
	})
})
