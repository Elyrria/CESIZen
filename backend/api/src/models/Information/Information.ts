import { addPublicationDateMiddleware } from "@models/utils/middleware.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import { INFORMATION_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import { FIELD} from "@configs/fields.configs.ts"
import mongoose, { Schema } from "mongoose"

/**
 * Information schema definition
 * Contains validation rules, indexes and data structure for information documents
 */
const informationSchema = new Schema<IInformationDocument>(
	{
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, INFORMATION_MESSAGE.required(FIELD.AUTHOR)],
		},
		title: {
			type: String,
			required: [true, INFORMATION_MESSAGE.required(FIELD.TITLE)],
			trim: true,
		},
		description: {
			type: String,
			required: [true, INFORMATION_MESSAGE.required(FIELD.DESCRIPTION_INFORMATION)],
			trim: true,
		},
		name: {
			type: String,
			required: [true, INFORMATION_MESSAGE.required(FIELD.NAME)],
			trim: true,
		},
		type: {
			type: String,
			enum: MEDIATYPE,
			required: [true, INFORMATION_MESSAGE.required(FIELD.TYPE)],
			trim: true,
		},
		content: {
			type: String,
			required: function (this: IInformationDocument) {
				return this.type === MEDIATYPE[0]
			},
			trim: true,
		},
		status: {
			type: String,
			enum: STATUS,
			default: STATUS[0],
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
			required: function (this: IInformationDocument) {
				return this.type !== MEDIATYPE[0]
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
informationSchema.index({ authorId: 1 })
informationSchema.index({ createdAt: -1 })
informationSchema.index({ status: 1 })
informationSchema.index({ type: 1 })
informationSchema.index({ fileId: 1 }) // Index for GridFS file references

// Add middlewares
addPublicationDateMiddleware(informationSchema)
// addUniqueValidationMiddleware(informationSchema)  // Uncomment if needed

// Create and export the model
const Information = mongoose.model<IInformationDocument>("Information", informationSchema)

export default Information
