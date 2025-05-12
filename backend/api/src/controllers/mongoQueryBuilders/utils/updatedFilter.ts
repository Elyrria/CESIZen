import type { IQueryInterface } from "@api/types/request.d.ts"
import type { Request } from "express"

export const getUpdatedFilter = (req: Request, query: IQueryInterface): void => {
	if (req.query.updatedFrom || req.query.updatedTo) {
		query.createdAt = {}
		if (req.query.updatedFrom) {
			query.createdAt.$gte = new Date(req.query.updatedFrom as string)
		}
		if (req.query.updatedTo) {
			query.createdAt.$lte = new Date(req.query.updatedTo as string)
		}
	}
}
