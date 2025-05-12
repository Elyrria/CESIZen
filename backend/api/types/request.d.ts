import { Request } from "express"
import { IUser } from "@api/types/user.d.ts"
import { IRefreshTokenRequest } from "@api/types/tokens.d.ts"

declare global {
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
}

export interface IAuthRequest extends Request {
	auth?: {
		userId: string
	}
}


export type TSanitizedKeys = "sanitizedBody" | "sanitizedQuery" | "sanitizedParams"
