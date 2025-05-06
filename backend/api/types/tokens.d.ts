import { type IUser } from "@api/types/user.d.ts"
import { type Role } from "@configs/role.configs.ts"
import type { Document } from "mongoose"

export interface IAccessToken {
	accessToken: string
}
export interface IRefreshToken {
	refreshToken: string
	userId: mongoose.Types.ObjectId
	userAgent: string
	ipAddress: string
	isRevoked: boolean
	expiresAt: Date
	createdAt: Date
	updatedAt?: Date
}

export interface IRefreshTokenDocument extends Document, IRefreshToken {
	// Methods
	isExpired(): boolean
	revokeToken(): void
}


export interface ITokens extends IAccessToken, Pick<IRefreshToken, "refreshToken"> {}

export type IRefreshTokenCreate = Pick<IRefreshToken, "ipAddress" | "userAgent" | "refreshToken" | "userId">

export type IRefreshTokenRequest = Pick<IRefreshToken, "refreshToken"> & Pick<IRefreshTokenCreate, "userId">

export interface IDecodedToken {
	userId: mongoose.Types.ObjectId
	role: Role
}

export interface IUserToken extends Pick<IUser, "role"> {
	id: mongoose.Types.ObjectId
}
