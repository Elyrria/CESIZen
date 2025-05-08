import { SUCCESS_MESSAGE, SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { User, RefreshToken } from "@models/index.ts"
import { FIELD } from "@configs/fields.configs.ts"
import request from "supertest"
import app from "@core/app.ts"

describe("User createUser Route Functional Tests", () => {
	const newUser = {
		email: "functional-test@example.com",
		password: "Password123!",
		name: "Functional",
		firstName: "Test",
		birthDate: "1994-06-14",
		role: "user",
	}

	afterEach(async () => {
		// Retrieve the user to get their ID
		const user = await User.findOne({ email: newUser.email })
		if (user) {
			await RefreshToken.deleteMany({ userId: user._id })
		}
		// Delete the user
		await User.deleteMany({ email: newUser.email })
	})

	it("should create a new user successfully and persist it in the database", async () => {
		// Send a POST request to the user creation endpoint
		const response = await request(app).post("/api/v1/users/create").send(newUser)

		// Verify that the status is 201 (Created)
		expect(response.status).toBe(201)

		// Verify the basic structure of the response
		expect(response.body).toHaveProperty("success", true)
		expect(response.body).toHaveProperty("code", SUCCESS_CODE.USER_CREATED)
		expect(response.body).toHaveProperty("message", SUCCESS_MESSAGE.USER_CREATED)
		expect(response.body).toHaveProperty("data")
		expect(response.body.data).toHaveProperty("user")

		const user = response.body.data.user

		expect(user).toHaveProperty(FIELD.EMAIL, newUser.email)
		expect(user).toHaveProperty(FIELD.NAME, newUser.name)
		expect(user).toHaveProperty(FIELD.FIRST_NAME, newUser.firstName)
		expect(user).toHaveProperty(FIELD.ROLE, newUser.role)
		expect(user).toHaveProperty("active", true)
		expect(user).toHaveProperty("id") // Verify the presence of the ID

		// Verify that the response doesn't expose the password
		expect(user).not.toHaveProperty(FIELD.PASSWORD)
		// Verify the structure and content of data.tokens
		expect(response.body.data).toHaveProperty("tokens")
		const tokens = response.body.data.tokens

		expect(tokens).toHaveProperty(FIELD.ACCESS_TOKEN)
		expect(tokens).toHaveProperty(FIELD.REFRESH_TOKEN)

		// Verify that tokens are valid JWTs
		expect(tokens.accessToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
		expect(tokens.refreshToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
		// Verify that the user has been properly persisted in the database
		const createdUser = await User.findOne({ email: newUser.email })
		expect(createdUser).not.toBeNull()
		// Verify that the password has been properly hashed (should not be in plain text)
		expect(createdUser!.password).not.toBe(newUser.password)
	})
})
