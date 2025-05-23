import { SUCCESS_MESSAGE, SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { User, RefreshToken } from "@models/index.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { encrypt } from "@utils/crypto.ts"
import request from "supertest"
import app from "@core/app.ts"
import bcrypt from "bcrypt"

const isFunctionalTest = process.env.FUNCTIONAL_TEST === "true"
const describeIfFunctional = isFunctionalTest ? describe : describe.skip

describeIfFunctional("User API Functional Tests", () => {
	// Shared test data
	const adminUser = {
		email: "admin-test@example.com",
		password: "AdminPassword123!",
		name: "Admin",
		firstName: "Test",
		birthDate: "1990-01-01",
		role: "administrator",
		active: true,
	}

	const testUser = {
		email: "functional-test@example.com",
		password: "Password123!",
		name: "Functional",
		firstName: "Test",
		birthDate: "1994-06-14",
		role: "user",
	}

	const updatedUserData = {
		name: "UpdatedName",
		firstName: "UpdatedFirstName",
	}

	// Shared tokens and IDs (accessible across all describe blocks)
	let adminAccessToken: string
	let adminRefreshToken: string
	let userAccessToken: string
	let userRefreshToken: string
	let userId: string

	// Setup: Insert admin user
	beforeAll(async () => {
		console.log("Setting up test environment...")

		// Clean up any existing test data
		await User.deleteMany({
			email: {
				$in: [testUser.email, adminUser.email],
			},
		})

		// Hash the admin password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(adminUser.password, salt)

		// Encrypt fields that need encryption
		const encryptedName = encrypt(adminUser.name)
		const encryptedFirstName = encrypt(adminUser.firstName)
		const encryptedBirthDate = encrypt(adminUser.birthDate)

		// Insert admin user directly into the database with encrypted fields
		await User.create({
			email: adminUser.email,
			password: hashedPassword,
			name: encryptedName,
			firstName: encryptedFirstName,
			birthDate: encryptedBirthDate,
			role: adminUser.role,
			active: adminUser.active,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		console.log(`Admin user inserted with email: ${adminUser.email}`)
	})

	// Cleanup: Remove all test data
	afterAll(async () => {
		console.log("Cleaning up test environment...")

		await User.deleteMany({
			email: {
				$in: [testUser.email, adminUser.email],
			},
		})
		await RefreshToken.deleteMany({})

		console.log("Test cleanup completed")
	})

	// Group 1: Administrator Authentication
	describe("1. Admin Authentication", () => {
		it("should login with the pre-inserted admin user", async () => {
			console.log("Logging in with the pre-inserted admin...")

			const loginResponse = await request(app).post("/api/v1/users/login").send({
				email: adminUser.email,
				password: adminUser.password,
			})

			expect(loginResponse.status).toBe(200)
			expect(loginResponse.body).toHaveProperty("success", true)
			expect(loginResponse.body.data).toHaveProperty("tokens")
			expect(loginResponse.body.data.tokens).toHaveProperty("accessToken")
			expect(loginResponse.body.data.tokens).toHaveProperty("refreshToken")

			// Store tokens for later tests
			adminAccessToken = loginResponse.body.data.tokens.accessToken
			adminRefreshToken = loginResponse.body.data.tokens.refreshToken

			// Verify tokens format
			expect(adminAccessToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)
			expect(adminRefreshToken).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./)

			console.log("Admin login successful")
		})
	})

	// Group 2: User Management (Create, Get)
	describe("2. Admin User Management", () => {
		it("should create a standard user using admin privileges", async () => {
			console.log("Creating a standard user with admin privileges...")

			const createResponse = await request(app)
				.post("/api/v1/users/admin-create")
				.set("Authorization", `Bearer ${adminAccessToken}`)
				.send(testUser)
			expect(createResponse.status).toBe(201)
			expect(createResponse.body).toHaveProperty("success", true)
			expect(createResponse.body).toHaveProperty("code", SUCCESS_CODE.USER_CREATED)
			expect(createResponse.body).toHaveProperty("message", SUCCESS_MESSAGE.USER_CREATED)
			expect(createResponse.body).toHaveProperty("data")

			// Verify user data
			const userData = createResponse.body.data
			expect(userData).toHaveProperty(FIELD.EMAIL, testUser.email)
			expect(userData).toHaveProperty(FIELD.NAME, testUser.name)
			expect(userData).toHaveProperty(FIELD.FIRST_NAME, testUser.firstName)
			expect(userData).toHaveProperty(FIELD.ROLE, "user")
			expect(userData).toHaveProperty("id")

			// Save user ID for later tests
			userId = userData.id

			console.log(`Standard user created with ID: ${userId}`)
		})

		it("should retrieve all users as admin", async () => {
			console.log("Getting all users with admin privileges...")

			const getUsersResponse = await request(app)
				.get("/api/v1/users/get-users")
				.set("Authorization", `Bearer ${adminAccessToken}`)

			expect(getUsersResponse.status).toBe(200)
			expect(getUsersResponse.body).toHaveProperty("success", true)
			expect(getUsersResponse.body.data).toHaveProperty("users")
			expect(Array.isArray(getUsersResponse.body.data.users)).toBe(true)

			// Verify that our test users are in the list
			const users = getUsersResponse.body.data.users
			const foundAdmin = users.find((u: any) => u.email === adminUser.email)
			const foundUser = users.find((u: any) => u.email === testUser.email)

			expect(foundAdmin).toBeDefined()
			expect(foundUser).toBeDefined()

			console.log(`Retrieved ${users.length} users, including our test users`)
		})
	})

	// Group 3: Standard User Operations
	describe("3. Standard User Operations", () => {
		it("should login with the created standard user", async () => {
			console.log("Logging in with the standard user...")

			const loginResponse = await request(app).post("/api/v1/users/login").send({
				email: testUser.email,
				password: testUser.password,
			})

			expect(loginResponse.status).toBe(200)
			expect(loginResponse.body).toHaveProperty("success", true)
			expect(loginResponse.body.data).toHaveProperty("tokens")

			// Store tokens for later tests
			userAccessToken = loginResponse.body.data.tokens.accessToken
			userRefreshToken = loginResponse.body.data.tokens.refreshToken

			console.log("Standard user login successful")
		})

		it("should update standard user profile", async () => {
			console.log("Updating standard user profile...")

			const updateResponse = await request(app)
				.put(`/api/v1/users/update/${userId}`)
				.set("Authorization", `Bearer ${userAccessToken}`)
				.send(updatedUserData)
			console.log("Update response:", JSON.stringify(updateResponse.body, null, 2))

			expect(updateResponse.status).toBe(200)
			expect(updateResponse.body).toHaveProperty("success", true)
			expect(updateResponse.body).toHaveProperty("code", "userUpdated")
			expect(updateResponse.body).toHaveProperty("message", "Utilisateur mis à jour avec succès")

			expect(updateResponse.body).toHaveProperty("data")
			expect(updateResponse.body.data).toHaveProperty("user")
			expect(updateResponse.body.data).toHaveProperty("tokens")

			expect(updateResponse.body.data.user).toHaveProperty(FIELD.NAME, updatedUserData.name)
			expect(updateResponse.body.data.user).toHaveProperty(
				FIELD.FIRST_NAME,
				updatedUserData.firstName
			)

			console.log("User profile updated successfully")
		})

		it("should logout the standard user", async () => {
			console.log("Logging out standard user...")

			const logoutResponse = await request(app).post("/api/v1/users/logout").send({
				refreshToken: userRefreshToken,
			})

			expect(logoutResponse.status).toBe(200)
			expect(logoutResponse.body).toHaveProperty("success", true)
			expect(logoutResponse.body).toHaveProperty("code", "logoutSuccess")
			expect(logoutResponse.body).toHaveProperty("message", "Utilisateur déconnecté avec succès")

			// Verify refresh token is removed from database
			const refreshTokenExists = await RefreshToken.findOne({ refreshToken: userRefreshToken })
			expect(refreshTokenExists).toBeNull()

			console.log("Standard user logged out successfully")
		})
	})

	// Group 4: Admin Cleanup Operations
	describe("4. Admin Cleanup", () => {
		it("should delete the standard user as admin", async () => {
			console.log("Deleting standard user with admin privileges...")

			const deleteResponse = await request(app)
				.delete(`/api/v1/users/delete/${userId}`)
				.set("Authorization", `Bearer ${adminAccessToken}`)

			expect(deleteResponse.status).toBe(200)
			expect(deleteResponse.body).toHaveProperty("success", true)
			expect(deleteResponse.body).toHaveProperty("code", "userDeleted")
			expect(deleteResponse.body).toHaveProperty("message", "Utilisateur supprimé avec succès")

			// Verify user is deleted from database
			const deletedUser = await User.findOne({ email: testUser.email })
			expect(deletedUser).toBeNull()

			console.log("Standard user deleted successfully")
		})

		it("should logout the admin user", async () => {
			console.log("Logging out admin user...")

			const logoutResponse = await request(app).post("/api/v1/users/logout").send({
				refreshToken: adminRefreshToken,
			})

			expect(logoutResponse.status).toBe(200)
			expect(logoutResponse.body).toHaveProperty("success", true)

			// Verify refresh token is removed from database
			const refreshTokenExists = await RefreshToken.findOne({ refreshToken: adminRefreshToken })
			expect(refreshTokenExists).toBeNull()

			console.log("Admin user logged out successfully")
		})
	})
})
