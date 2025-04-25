import type { Request, Response, NextFunction } from "express"
import type { TSanitizedKeys } from "@api/types/request.d.ts"

export const useSanitizedData = (req: Request, _res: Response, next: NextFunction): void => {
	const sources = ["body"]
	for (const source of sources) {
		const sanitizedKey = `sanitized${source.charAt(0).toUpperCase() + source.slice(1)}` as TSanitizedKeys

		if (req[sanitizedKey]) {
			if (source === sources[0] && req.sanitizedBody) {
				req.body = req.sanitizedBody
			}
		}
	}

	next()
}
