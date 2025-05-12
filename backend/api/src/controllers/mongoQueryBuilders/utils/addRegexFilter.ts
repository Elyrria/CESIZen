import type { IQueryInterface } from "@api/types/request.d.ts"
import type  { Request } from "express"

export const getRegexFilter = (req: Request, query: IQueryInterface, field: keyof IQueryInterface): void => {
	if (req.query[field]) {
		query[field] = { $regex: req.query[field] as string, $options: "i" }
	}
}
