import { addPublicationDateMiddleware } from "@models/utils/middleware.ts"
import { ACTIVITY_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import type { IActivityDocument } from "@api/types/activity.d.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import { FIELD } from "@configs/fields.configs.ts"
import mongoose, { Schema } from "mongoose"

/**
 * Activity schema definition
 * Contains validation rules, indexes and data structure for activity documents
 */
const activitySchema = new Schema<IActivityDocument>(
	{
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, ACTIVITY_MESSAGE.required(FIELD.AUTHOR)],
		},
		name: {
			type: String,
			required: [true, ACTIVITY_MESSAGE.required(FIELD.NAME)],
			trim: true,
		},
		description: {
			type: String,
			required: [true, ACTIVITY_MESSAGE.required(FIELD.DESCRIPTION_ACTIVITY)],
			trim: true,
		},
		type: {
			type: String,
			enum: MEDIATYPE,
			required: [true, ACTIVITY_MESSAGE.required(FIELD.TYPE)],
			trim: true,
		},
		content: {
			type: String,
			required: function (this: IActivityDocument) {
				return this.type === MEDIATYPE[0] // TEXT
			},
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		parameters: {
			type: Object,
			default: {},
		},
		validatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		validatedAndPublishedAt: {
			type: Date,
			default: null,
		},
		// GridFS related fields
		fileId: {
			type: mongoose.Schema.Types.ObjectId,
			required: function (this: IActivityDocument) {
				return this.type === MEDIATYPE[1] // VIDEO
			},
		},
		fileMetadata: {
			filename: String,
			contentType: String,
			size: Number,
			uploadDate: Date,
			duration: Number,
			dimensions: {
				width: Number,
				height: Number,
			},
			encoding: String,
			bitrate: Number,
		},
		categoryId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: [true, ACTIVITY_MESSAGE.required(FIELD.CATEGORY_ID)],
				ref: "Category",
			},
		],
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
activitySchema.index({ authorId: 1 })
activitySchema.index({ createdAt: -1 })
activitySchema.index({ isActive: 1 })
activitySchema.index({ type: 1 })
activitySchema.index({ fileId: 1 }) // Index for GridFS file references
activitySchema.index({ categoryId: 1 }) // Index for category lookup

export default activitySchema
