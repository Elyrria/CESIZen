import { Request } from "express"
import {IUser} from "@api/types/user.d.ts"

declare global {
	namespace Express {
		interface Request {
			sanitizedQuery: any
			sanitizedBody: IUser
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
