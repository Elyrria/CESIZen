/**
 * Custom interface for MongoDB error handling
 */
export interface IMongoError extends Error {
	code?: number
	keyPattern?: Record<string, any>
}
