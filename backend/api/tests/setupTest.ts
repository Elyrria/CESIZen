import { beforeAll, afterEach, afterAll } from "@jest/globals" // Import Jest lifecycle hooks for test setup and teardown
import { MongoMemoryServer } from "mongodb-memory-server" // Import the in-memory MongoDB server for isolated testing
import mongoose from "mongoose" // Import Mongoose ODM for MongoDB interactions

// Define the MongoDB server variable with proper typing to avoid TypeScript errors
let mongoServer: MongoMemoryServer
const isFunctionalTest = process.env.FUNCTIONAL_TEST === "true"
/**
 * Connect to the in-memory database before running any tests.
 */
beforeAll(async () => {
	// Create an in-memory MongoDB server with optimized configuration
	mongoServer = await MongoMemoryServer.create({
		instance: {
			dbName: "test-db", // Explicit name for the test database for better debugging
			// Use WiredTiger storage engine for better performance
			// Increase memory limit
			storageEngine: "wiredTiger",
		},
	})
	const mongoUri = mongoServer.getUri() // Get the connection string for the temporary database

	// Log the connection URI for debugging purposes
	console.log(`MongoDB Memory Server running at ${mongoUri}`)

	// Connect Mongoose to the in-memory database
	await mongoose.connect(mongoUri, {})
})

/**
 * Clear all test data after each individual test to ensure test isolation.
 */
afterEach(async () => {
	if (!isFunctionalTest) {
		try {
			const collections = mongoose.connection.collections
			const promises = Object.values(collections).map((collection) => collection.deleteMany({}))
			await Promise.all(promises)
			console.log("All collections cleared")
		} catch (error) {
			console.error("Error clearing the database", error)
		}
	}
})

/**
 * Cleanup: disconnect from the database and stop the MongoDB server after all tests.
 */
afterAll(async () => {
	// Check connection state before disconnecting to prevent errors
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect()
	}
	if (mongoServer) {
		await mongoServer.stop()
		console.log("MongoDB Memory Server stopped")
	}
})

/**
 * Helper function to reset a specific collection.
 * Useful for tests that need a specific clean state for just one collection.
 *
 * @param collectionName - The name of the collection to reset
 */
export const resetCollection = async (collectionName: string): Promise<void> => {
	// Validate that the database connection is open
	if (mongoose.connection.readyState !== 1) {
		throw new Error("Database connection not open")
	}

	// Get the collection and validate it exists
	const collection = mongoose.connection.collection(collectionName)
	if (!collection) {
		throw new Error(`Collection ${collectionName} not found`)
	}

	// Clear all documents from the collection
	await collection.deleteMany({})
	console.log(`Collection ${collectionName} has been reset`)
}

/**
 * Helper function to seed the database with test data.
 * Allows for easy test data setup with proper typing.
 *
 * @param model - The mongoose model to create documents in
 * @param data - Array of document data to insert
 * @returns - The created documents with IDs and full Mongoose document instances
 */
export const seedDatabase = async <T>(model: mongoose.Model<T>, data: Array<Partial<T>>): Promise<Array<T>> => {
	try {
		return await model.create(data)
	} catch (error) {
		console.error(`Error seeding ${model.modelName}`, error)
		throw error
	}
}
