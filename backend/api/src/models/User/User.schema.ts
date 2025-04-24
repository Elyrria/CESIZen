import { addUniqueValidationMiddleware } from "@models/utils/middleware.ts"
import { USER_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { FIELD, CONFIG_FIELD } from "@configs/fields.configs.ts"
import type { IUserDocument } from "@api/types/user.d.ts"
import { ROLE_HIERARCHY } from "@configs/role.configs.ts"
import { Schema } from "mongoose"
/**
 * User schema definition
 * Contains validation rules, indexes and data structure for user documents
 */
const userSchema = new Schema<IUserDocument>(
	{
		email: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.EMAIL)],
			unique: true,
			trim: true,
			lowercase: true, // Ensures emails are always lowercase
			match: [/^\S+@\S+\.\S+$/, USER_MESSAGE.emailInvalid],
			index: true, // Improves query performance
		},
		password: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.PASSWORD)],
			trim: true,
			select: false, // Prevents password from being included in query results by default
		},
		name: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.NAME)],
			trim: true,
		},
		firstName: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.FIRST_NAME)],
			trim: true,
		},
		role: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.ROLE)],
			enum: {
				values: ROLE_HIERARCHY,
				message: 'The role "{VALUE}" is invalid',
			},
			default: ROLE_HIERARCHY[ROLE_HIERARCHY.length - 1], // Sets the default role to the lowest privilege
		},
		birthDate: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.BIRTH_DATE)],
		},
		active: {
			type: Boolean,
			default: true, // Allows disabling accounts without deletion
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
userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })

addUniqueValidationMiddleware(userSchema)

export default userSchema
