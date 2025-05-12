import { type Request } from "express"
/**
 * Gets pagination options from request
 *
 * @param req - The request object
 * @returns Pagination options including skip, limit, sort and page info
 */

export const getPaginationOptions = (
    req: Request
): {
    page: number
    limit: number
    skip: number
    sortOptions: { [key: string]: 1 | -1 }
} => {
    // Pagination options
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Sorting options
    const sortBy: string = (req.query.sortBy as string) || "createdAt"
    const sortOrder: 1 | -1 = (req.query.sortOrder as string) === "asc" ? 1 : -1
    const sortOptions = { [sortBy]: sortOrder }
    return { page, limit, skip, sortOptions }
}
