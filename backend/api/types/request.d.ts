import { Request } from "express"
import {IUser} from "@api/types/user.d.ts"
import { IRefreshTokenRequest } from "@api/types/tokens.d.ts"

declare global {
	namespace Express {
		interface Request {
			sanitizedQuery: any
			sanitizedBody: IUser | IRefreshTokenRequest | null
			sanitizedParams: any
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
