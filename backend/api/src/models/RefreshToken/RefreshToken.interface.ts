import mongoose, { Document } from "mongoose"

export interface IRefreshToken extends Document {
	refreshToken: string
	userId: mongoose.Schema.Types.ObjectId
	userAgent?: string
	ipAddress?: string
	isRevoked: boolean
	expiresAt: Date
	createdAt: Date
	updatedAt?: Date

	// Methods
	isExpired(): boolean
	revokeToken(): void
}
