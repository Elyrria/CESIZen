import { SUCCESS_MESSAGE, SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import * as tokenGenerator from "@controllers/auth/utils/generateTokens.ts"
import { ERROR_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { FIELD } from "@configs/fields.configs.ts"
import * as cryptoUtils from "@utils/crypto.ts"
import { User } from "@models/index.ts"
import request from "supertest"
import app from "@core/app.ts"

// Mock dependencies
jest.mock("@utils/crypto.ts", () => ({
	processUserData: jest.fn(),
	decryptData: jest.fn(),
}))

jest.mock("@controllers/auth/utils/generateTokens.ts", () => ({
	generateAccesToken: jest.fn(),
	generateRefreshToken: jest.fn(),
}))

describe("User Controller Integration Tests", () => {
	// Test data
	const accessToken =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ1NTY2NzIzfQ.BP32l2ODTEmjQbj6Kj00nS6jCMmfmPB6izhxqcrVY5E"
	const refreshToken =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"

	const newUser = {
		email: "johndoe@gmail.com",
		password: "Password123!",
		name: "Doe",
		firstName: "John",
		birthDate: "1994-06-14",
		role: "user",
	}

	const userId = "680b387ebb62a1b442d8a191"
	const currentDate = new Date().toISOString()

	// Configuration before each test
	beforeEach(() => {
		jest.clearAllMocks()

		// Mock processUserData to return a user with save method
		;(cryptoUtils.processUserData as jest.Mock).mockImplementation((userData) => ({
			...userData,
			save: jest.fn().mockResolvedValue({
				_id: userId,
				...userData,
				active: true,
				createdAt: currentDate,
				updatedAt: currentDate,
				__v: 0,
				password: "hashed_password",
				toObject: () => ({
					_id: userId,
					...userData,
					active: true,
					createdAt: currentDate,
					updatedAt: currentDate,
					__v: 0,
					password: "hashed_password",
				}),
			}),
		}))

		// Mock decryptData
		;(cryptoUtils.decryptData as jest.Mock).mockImplementation((data) => ({
			...data,
			id: userId,
		}))

		// Mock token generators
		;(tokenGenerator.generateAccesToken as jest.Mock).mockReturnValue(accessToken)
		;(tokenGenerator.generateRefreshToken as jest.Mock).mockResolvedValue(refreshToken)

		// Ensure findOne returns null (user doesn't exist)
		jest.spyOn(User, "findOne").mockResolvedValue(null)
	})

	it("should create a new user successfully and return all expected fields", async () => {
		// Send a POST request to the user creation endpoint
		const response = await request(app).post("/api/v1/users/create").send(newUser)

		// Verify that the status is 201 (Created)
		expect(response.status).toBe(201)

		// Verify the basic structure of the response
		expect(response.body).toHaveProperty("success", true)
		expect(response.body).toHaveProperty("code", SUCCESS_CODE.USER_CREATED)
		expect(response.body).toHaveProperty("message", SUCCESS_MESSAGE.USER_CREATED)
		expect(response.body).toHaveProperty("data")

		// Verify the structure and content of data.user
		expect(response.body.data).toHaveProperty("user")
		const user = response.body.data.user
		const extractedBirthDate = user.birthDate.split("T")[0] // Simulate date conversion with dateToString()
		// Verify all user fields
		expect(user).toHaveProperty(FIELD.EMAIL, newUser.email)
		expect(user).toHaveProperty(FIELD.NAME, newUser.name)
		expect(user).toHaveProperty(FIELD.FIRST_NAME, newUser.firstName)
		expect(extractedBirthDate).toBe(newUser.birthDate)
		expect(user).toHaveProperty(FIELD.ROLE, newUser.role)
		expect(user).toHaveProperty("active", true)
		expect(user).toHaveProperty("createdAt")
		expect(user).toHaveProperty("updatedAt")
		expect(user).toHaveProperty("__v", 0)
		expect(user).toHaveProperty("id", userId)

		// Ensure that the password is not present
		expect(user).not.toHaveProperty(FIELD.PASSWORD)

		// Verify the format of dates
		expect(new Date(user.createdAt).toISOString()).toBeTruthy()
		expect(new Date(user.updatedAt).toISOString()).toBeTruthy()

		// Verify the structure and content of data.tokens
		expect(response.body.data).toHaveProperty("tokens")
		const tokens = response.body.data.tokens

		expect(tokens).toHaveProperty(FIELD.ACCESS_TOKEN, accessToken)
		expect(tokens).toHaveProperty(FIELD.REFRESH_TOKEN, refreshToken)

		// Verify that tokens are in JWT format
		expect(tokens.accessToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
		expect(tokens.refreshToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
	})

	it("should return error when user already exists", async () => {
		// Simulate an already existing user
		jest.spyOn(User, "findOne").mockResolvedValueOnce({
			_id: "existing_id",
			email: newUser.email,
		} as any)

		// Send a POST request to the user creation endpoint
		const response = await request(app).post("/api/v1/users/create").send(newUser)

		// Verify that the status is 400 (Bad Request)
		expect(response.status).toBe(409)

		// Verify that the response contains an 'error' property
		expect(response.body).toHaveProperty("error")

		// Verify the error message
		expect(response.body.error).toHaveProperty("message", ERROR_MESSAGE.UNABLE_TO_CREATE)
	})

	it("should return error when required fields are missing", async () => {
		// Send a request without required fields
		const response = await request(app).post("/api/v1/users/create").send({
			email: "test@example.com", // Just email, without other required fields
		})

		// Verify that the status is 400 (Bad Request)
		expect(response.status).toBe(400)

		// Verify that the response contains an 'error' property
		expect(response.body).toHaveProperty("error")

		// Verify the error message
		expect(response.body.error).toHaveProperty("message", ERROR_MESSAGE.VALIDATION_FAILED)
	})

	it("should handle server error during token generation", async () => {
		// Simulate an error during token generation
		;(tokenGenerator.generateAccesToken as jest.Mock).mockImplementation(() => {
			throw new Error(ERROR_MESSAGE.SERVER_ERROR)
		})

		// Send a POST request to the user creation endpoint
		const response = await request(app).post("/api/v1/users/create").send(newUser)

		// Verify that the status is 500 (Internal Server Error)
		expect(response.status).toBe(500)

		// Verify that the response contains an 'error' property
		expect(response.body).toHaveProperty("error")

		// Verify the error message
		expect(response.body.error).toHaveProperty("message", ERROR_MESSAGE.SERVER_ERROR)
	})
})
