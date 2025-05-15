import { IRefreshTokenRequest } from "@api/types/tokens.d.ts"
import { IUser } from "@api/types/user.d.ts"
import { mongoose } from "mongoose"
import { Request } from "express"
import { Multer } from "multer"

declare global {
	type ObjectId = mongoose.Types.ObjectId
	namespace Express {
		interface Request {
			sanitizedQuery: IUser | IRefreshTokenRequest | null
			sanitizedBody: IUser | IRefreshTokenRequest | null
			sanitizedParams: IUser | IRefreshTokenRequest | null
			queryPolluted: any
			rateLimit?: {
				limit: number
				used: number
				remaining: number
				resetTime: Date
			}
			getSanitizedQuery?: () => any
			getSanitizedBody?: () => any
			getSanitizedParams?: () => any
		}
	}
}

export interface IQueryInterface {
	role?: { $ne?: string; $in?: string[] }
	email?: { $regex: string; $options: string }
	name?: { $regex: string; $options: string }
	firstname?: { $regex: string; $options: string }
	createdAt?: { $lte?: Date; $gte?: Date }
	updatedAt?: { $lte?: Date; $gte?: Date }
	type?: { $in?: string[] }
	status?: { $in?: string[] }
	authorId?: ObjectId
	validatedAndPublishedAt?: null | { $ne?: null }
	isActive?: boolean
	categoryId?: ObjectId
}

export interface IAuthRequest extends Request {
	auth?: {
		userId: string
	}
	file?: Express.Multer.File
}

export type TSanitizedKeys = "sanitizedBody" | "sanitizedQuery" | "sanitizedParams"
