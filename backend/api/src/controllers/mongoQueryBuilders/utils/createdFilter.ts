import type { IQueryInterface } from "@api/types/request.d.ts"
import type { Request } from "express"

export const getCreatedFilter = (req: Request, query: IQueryInterface): void => {
	if (req.query.createdFrom || req.query.createdTo) {
		query.createdAt = {}
		if (req.query.createdFrom) {
			query.createdAt.$gte = new Date(req.query.createdFrom as string)
		}
		if (req.query.createdTo) {
			query.createdAt.$lte = new Date(req.query.createdTo as string)
		}
	}
}
