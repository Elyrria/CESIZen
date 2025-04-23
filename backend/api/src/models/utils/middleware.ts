import mongoose, { Schema } from "mongoose"
import type {IMongoError} from "@api/types/mongoError.d.ts"

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
