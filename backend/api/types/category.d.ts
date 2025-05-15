// types/category.d.ts
import type { Document } from "mongoose"
import { mongoose } from "mongoose"

/**
 * Interface for Category data
 */
export interface ICategory {
	_id?: ObjectId
	name: string
	createdBy: ObjectId
	updatedBy?: ObjectId
	isActive: boolean
	createdAt?: Date
	updatedAt?: Date
}

/**
 * Extends the ICategory interface with Mongoose Document properties
 * Used for database operations and document instance methods
 */
export interface ICategoryDocument extends ICategory, Document {}
