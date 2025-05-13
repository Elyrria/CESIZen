import type { IMongoError } from "@api/types/mongoError.d.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import { Schema } from "mongoose"

type NextFunction = (err?: Error | null) => void
/**
 * Adds middleware to handle unique constraint violations
 */
export function addUniqueValidationMiddleware(schema: Schema): void {
	schema.post("save", function (error: IMongoError, _doc: any, next: NextFunction) {
		if ((error.name === "MongoError" || error.name === "MongoServerError") && error.code === 11000) {
			const field =
				error.keyPattern && Object.keys(error.keyPattern).length > 0
					? Object.keys(error.keyPattern)[0]
					: "field"
			next(new Error(`The ${field} already exists`))
		} else {
			next(error)
		}
	})

	schema.post(
		["findOneAndUpdate", "updateOne", "updateMany"],
		function (error: IMongoError, _doc: any, next: NextFunction) {
			if (
				(error.name === "MongoError" || error.name === "MongoServerError") &&
				error.code === 11000
			) {
				const field =
					error.keyPattern && Object.keys(error.keyPattern).length > 0
						? Object.keys(error.keyPattern)[0]
						: "field"
				next(new Error(`The ${field} already exists`))
			} else {
				next(error)
			}
		}
	)
}
/**
 * Middleware to automatically set validatedAndPublishedAt date when status changes to PUBLISHED
 * @param schema - The mongoose schema to add this middleware to
 */
export function addPublicationDateMiddleware(schema: Schema): void {
	schema.pre(["findOneAndUpdate", "updateOne"], function (next) {
		const update = this.getUpdate() as any

		// If updating to PUBLISHED status
		if (update && update.$set && update.$set.status === "PUBLISHED") {
			// Check if validatedAndPublishedAt is not already set
			if (!update.$set.validatedAndPublishedAt) {
				// Set the current date
				update.$set.validatedAndPublishedAt = new Date()
			}
		}

		next()
	})
}
