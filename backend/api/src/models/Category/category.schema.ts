import { CATEGORY_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import type { ICategoryDocument } from "@api/types/category.d.ts"
import { FIELD } from "@configs/fields.configs.ts"
import mongoose, { Schema } from "mongoose"

/**
 * Category schema definition
 * Contains validation rules, indexes and data structure for category documents
 */
const categorySchema = new Schema<ICategoryDocument>(
	{
		name: {
			type: String,
			required: [true, CATEGORY_MESSAGE.required(FIELD.NAME)],
			trim: true,
			minlength: [2, CATEGORY_MESSAGE.minLength(FIELD.NAME, 2)],
			maxlength: [50, CATEGORY_MESSAGE.maxLength(FIELD.NAME, 50)],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, CATEGORY_MESSAGE.required(FIELD.CREATED_BY)],
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true, // Automatically manages createdAt and updatedAt fields
		toJSON: { virtuals: true }, // Includes virtual properties when converting to JSON
		toObject: { virtuals: true }, // Includes virtual properties when converting to objects
	}
)

/**
 * Optimize query performance with additional indexes
 */
categorySchema.index({ name: 1 }, { unique: true })
categorySchema.index({ createdAt: -1 })
categorySchema.index({ isActive: 1 })

export default categorySchema
