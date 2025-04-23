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
			minlength: [
				CONFIG_FIELD.LENGTH.PASSWORD.MIN,
				USER_MESSAGE.minLength(FIELD.PASSWORD, CONFIG_FIELD.LENGTH.PASSWORD.MIN),
			],
			maxlength: [
				CONFIG_FIELD.LENGTH.PASSWORD.MAX,
				USER_MESSAGE.maxLength(FIELD.PASSWORD, CONFIG_FIELD.LENGTH.PASSWORD.MAX),
			],
			select: false, // Prevents password from being included in query results by default
		},
		name: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.NAME)],
			trim: true,
			minlength: [
				CONFIG_FIELD.LENGTH.NAME.MIN,
				USER_MESSAGE.minLength(FIELD.NAME, CONFIG_FIELD.LENGTH.NAME.MIN),
			],
			maxlength: [
				CONFIG_FIELD.LENGTH.NAME.MAX,
				USER_MESSAGE.maxLength(FIELD.NAME, CONFIG_FIELD.LENGTH.NAME.MAX),
			],
		},
		firstName: {
			type: String,
			required: [true, USER_MESSAGE.required(FIELD.FIRST_NAME)],
			trim: true,
			minlength: [
				CONFIG_FIELD.LENGTH.FIRST_NAME.MIN,
				USER_MESSAGE.minLength(FIELD.FIRST_NAME, CONFIG_FIELD.LENGTH.FIRST_NAME.MIN),
			],
			maxlength: [
				CONFIG_FIELD.LENGTH.FIRST_NAME.MAX,
				USER_MESSAGE.maxLength(FIELD.FIRST_NAME, CONFIG_FIELD.LENGTH.FIRST_NAME.MAX),
			],
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
			type: Date,
			required: [true, USER_MESSAGE.required(FIELD.BIRTH_DATE)],
			validate: {
				validator: function (value: Date) {
					return value < new Date() // Ensures birth date is in the past
				},
				message: "Birth date cannot be in the future",
			},
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
 * Virtual property that combines firstName and lastName
 * Not stored in the database but calculated on demand
 */
userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.name}`
})
/**
 * Optimize query performance with additional indexes
 */
userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })

addUniqueValidationMiddleware(userSchema)

export default userSchema
