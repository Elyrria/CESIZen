import type { IRefreshToken } from "@models/RefreshToken/RefreshToken.interface.ts"
import { addUniqueValidationMiddleware } from "@models/utils/middleware.ts"
import { TOKEN_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD } from "@configs/fields.configs.ts"
import mongoose, { Schema } from "mongoose"

const refreshTokenSchema: Schema<IRefreshToken> = new mongoose.Schema(
	{
		refreshToken: {
			type: String,
			required: [true, TOKEN_MESSAGE.refreshTokenRequired],
			unique: true,
			index: true, // Add index for better query performance
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId instead of String
			required: true,
			ref: "User", // Reference the User model directly
		},
		userAgent: {
			type: String,
			required: false,
		},
		ipAddress: {
			type: String,
			required: false,
		},
		isRevoked: {
			type: Boolean,
			default: false,
		},
		expiresAt: {
			type: Date,
			required: true,
			default: () => {
				const days = parseInt(CONFIG_FIELD.TIME.REFRESH_TOKEN_EXPIRATION.replace(/\D/g, ""))
				const now = new Date()
				return new Date(now.setDate(now.getDate() + days))
			},
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
			expires: CONFIG_FIELD.TIME.REFRESH_TOKEN_EXPIRATION,
		},
	},
	{
		timestamps: true,
	}
)

// Add indexes for common query patterns
refreshTokenSchema.index({ userId: 1 })
refreshTokenSchema.index({ expiresAt: 1 })

// Add method to check if token is expired
refreshTokenSchema.methods.isExpired = function (): boolean {
	return Date.now() >= this.expiresAt.getTime()
}

// Add method to revoke token
refreshTokenSchema.methods.revokeToken = function (): void {
	this.isRevoked = true
}

// Static method to find valid tokens
refreshTokenSchema.statics.findValid = function (userId: mongoose.Types.ObjectId) {
	return this.find({
		userId,
		isRevoked: false,
		expiresAt: { $gt: new Date() },
	})
}

addUniqueValidationMiddleware(refreshTokenSchema)

export default refreshTokenSchema