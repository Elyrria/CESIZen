import { encrypt, decrypt, processUserData, processRefreshToken, decryptData } from "@utils/crypto.ts"
// import { RefreshToken } from "@models/RefreshToken/RefreshToken.model.ts"
import { FIELD } from "@configs/fields.configs.ts"
// import { User } from "@models/User/User.model.ts"
import type { ObjectId } from "mongoose"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

jest.mock("bcrypt", () => ({
	hash: jest.fn().mockResolvedValue("hashed_password"),
}))

describe("encrypt", () => {
	// Test for basic encryption
	it("should encrypt a simple string correctly", () => {
		const result = encrypt("test")
		// Check format - should contain IV and encrypted data separated by ":"
		expect(result).toContain(":")
		const parts = result.split(":")
		expect(parts.length).toBe(2)
		// Both parts should be hex strings
		expect(/^[0-9a-f]+$/.test(parts[0])).toBe(true)
		expect(/^[0-9a-f]+$/.test(parts[1])).toBe(true)
	})

	// Test for complex string encryption
	it("should encrypt a string with special characters", () => {
		const result = encrypt("Test@123!#+éèê")
		expect(result).toContain(":")
	})

	// Test for encryption consistency
	it("should generate different encrypted results for the same input", () => {
		const result1 = encrypt("test")
		const result2 = encrypt("test")
		// Different IVs should produce different encrypted results
		expect(result1).not.toBe(result2)
	})
})

describe("decrypt", () => {
	// Test for basic decryption
	it("should decrypt an encrypted string correctly", () => {
		const original = "test"
		const encrypted = encrypt(original)
		const decrypted = decrypt(encrypted)
		expect(decrypted).toBe(original)
	})

	// Test for decryption of special characters
	it("should correctly decrypt strings with special characters", () => {
		const original = "Test@123!#+éèê"
		const encrypted = encrypt(original)
		const decrypted = decrypt(encrypted)
		expect(decrypted).toBe(original)
	})

	// Test for error handling with malformed input
	it("should throw an error for malformed input", () => {
		expect(() => decrypt("malformatted_string")).toThrow()
	})
})

describe("processUserData", () => {
	jest.clearAllMocks()

	jest.mock("@models/index.ts", () => ({
		User: jest.fn().mockImplementation((data) => data),
	}))

	// Test for processing user data
	it("should process and encrypt user data correctly", async () => {
		const userData = {
			email: "test@example.com",
			password: "password123!",
			name: "Doe",
			firstName: "John",
			birthDate: new Date(1990, 0, 1),
		}

		const result = await processUserData(userData)

		// Check if sensitive fields are encrypted
		expect(result.name).not.toBe(userData.name)
		expect(result.name).toContain(":")

		expect(result.firstName).not.toBe(userData.firstName)
		expect(result.firstName).toContain(":")

		expect(result.birthDate).not.toBe(userData.birthDate)
		expect(result.birthDate).toContain(":")

		// Check if password is hashed
		expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10)
		expect(result.password).toBe("hashed_password")

		// Email should remain unencrypted
		expect(result.email).toBe(userData.email)
	})
})

describe("processRefreshToken", () => {
	// Mock implementations
	jest.mock("@models/index.ts", () => ({
		RefreshToken: jest.fn().mockImplementation((data) => data),
	}))

	// Test for processing refresh token
	it("should encrypt IP and user agent in refresh token", async () => {
		const validMongoId = new mongoose.Types.ObjectId().toString()
		const tokenData = {
			refreshToken: "token123",
			userId: validMongoId,
			ipAddress: "192.168.1.1",
			userAgent: "Mozilla/5.0",
		}

		const result = await processRefreshToken(tokenData)

		// Check if sensitive fields are encrypted
		expect(result.ipAddress).not.toBe(tokenData.ipAddress)
		expect(result.ipAddress).toContain(":")

		expect(result.userAgent).not.toBe(tokenData.userAgent)
		expect(result.userAgent).toContain(":")

		// Token and userId should remain unencrypted
		expect(result.refreshToken).toBe(tokenData.refreshToken)
		expect(result.userId.toString()).toBe(tokenData.userId.toString())
	})

	// Test for MongoDB ID validation
	it("should validate that userId is a valid MongoDB ID", async () => {
		const invalidId = "invalid-id-format"
		const tokenData = {
			refreshToken: "token123",
			userId: invalidId,
			ipAddress: "192.168.1.1",
			userAgent: "Mozilla/5.0",
		}

		// Should throw error for invalid MongoDB ID
		await expect(processRefreshToken(tokenData)).rejects.toThrow()

		// Test with valid ID format
		const validId = new mongoose.Types.ObjectId().toString()
		const validTokenData = { ...tokenData, userId: validId }

		// Should not throw error for valid MongoDB ID
		await expect(processRefreshToken(validTokenData)).resolves.toBeDefined()
	})
})

describe("decryptData", () => {
	// Test for decrypting user data
	it("should decrypt specified fields in user data", () => {
		// Create user with encrypted fields
		const name = encrypt("Doe")
		const firstName = encrypt("John")
		const birthDate = encrypt("1990-01-01T00:00:00.000Z")

		const userData = {
			email: "test@example.com",
			name,
			firstName,
			birthDate,
		}

		const result = decryptData(userData, [FIELD.NAME, FIELD.FIRST_NAME, FIELD.BIRTH_DATE])

		// Check if fields are properly decrypted
		expect(result.name).toBe("Doe")
		expect(result.firstName).toBe("John")
		expect(result.birthDate instanceof Date).toBe(true)

		// Unencrypted fields should remain unchanged
		expect(result.email).toBe(userData.email)
	})

	// Test for handling decryption errors
	it("should handle decryption errors gracefully", () => {
		// Create user with invalid encrypted field
		const userData = {
			name: "invalid-encrypted-value",
			email: "test@example.com",
		}

		// Mock console.error to prevent test output clutter
		jest.spyOn(console, "error").mockImplementation(() => {})

		const result = decryptData(userData, [FIELD.NAME])

		// Should provide a placeholder for the failed field
		expect(result.name).toBe("[Encrypted name]")

		// Unencrypted fields should remain unchanged
		expect(result.email).toBe(userData.email)
	})
})
