import type { Request, Response, NextFunction } from "express"
import sanitize from "mongo-sanitize"
import { logSecurityEvent } from "@logs/logger.ts"

/**
 * List of common MongoDB operators
 */
const MONGO_OPERATORS = [
	"$eq",
	"$gt",
	"$gte",
	"$in",
	"$lt",
	"$lte",
	"$ne",
	"$nin",
	"$or",
	"$and",
	"$not",
	"$nor",
	"$exists",
	"$type",
	"$expr",
	"$jsonSchema",
	"$mod",
	"$regex",
	"$text",
	"$where",
	"$all",
	"$elemMatch",
	"$size",
	"$bitsAllClear",
	"$bitsAllSet",
	"$bitsAnyClear",
	"$bitsAnySet",
	"$comment",
	"$meta",
	"$slice",
]

/**
 * Checks if a string contains MongoDB operators
 *
 * @param {string} str - String to check
 * @returns {boolean} - True if the string contains MongoDB operators
 */
const stringContainsMongoOperator = (str: string): boolean => {
	if (typeof str !== "string") return false

	// Check if the string contains a MongoDB operator
	for (const op of MONGO_OPERATORS) {
		if (str.includes(op)) return true
	}

	return false
}

/**
 * Checks if a key contains MongoDB operators or special patterns
 *
 * @param {string} key - Key to check
 * @returns {boolean} - True if the key contains MongoDB operators
 */
const containsMongoOperatorInKey = (key: string): boolean => {
	// Check for $ at the beginning
	if (key.startsWith("$")) return true

	// Check for patterns like field[$operator]
	if (key.includes("[$") && key.includes("]")) return true

	// Check for dot notation with operators
	if (key.includes(".") && (key.includes("$") || key.includes("["))) return true

	return false
}

/**
 * Checks if a value contains MongoDB operators
 *
 * @param {any} value - Value to check
 * @returns {boolean} - True if the value contains MongoDB operators
 */
const containsMongoOperatorInValue = (value: any): boolean => {
	// If not a string, check if it's an object with operators
	if (typeof value !== "string") {
		if (typeof value === "object" && value !== null) {
			// Check if any key starts with $
			return Object.keys(value).some((k) => k.startsWith("$"))
		}
		return false
	}

	// Check if the value is directly a MongoDB operator
	if (MONGO_OPERATORS.includes(value)) return true

	// Check if the string contains an operator without being a JSON
	if (stringContainsMongoOperator(value)) return true

	// Check if it's a JSON that might contain operators
	if (value.includes("$") && (value.includes("{") || value.includes("["))) {
		try {
			const parsed = JSON.parse(value)
			// Check if the JSON contains MongoDB operators
			return JSON.stringify(parsed).includes("$")
		} catch (e) {
			// Not valid JSON, check for common injection patterns
			return (
				value.includes("$ne") ||
				value.includes("$gt") ||
				value.includes("$lt") ||
				value.includes("$exists")
			)
		}
	}

	return false
}

/**
 * Sanitizes an object by removing MongoDB operators
 *
 * @param {any} obj - Object to sanitize
 * @param {string} path - Current path in the object (for logging)
 * @returns {object} - Sanitized object and detection info
 */
const sanitizeMongoObject = (obj: any, path = ""): { sanitized: any; changes: string[] } => {
	const sanitized: any = {}
	const changes: string[] = []
	// For each key in the object
	for (const key in obj) {
		const value = obj[key]
		const currentPath = path ? `${path}.${key}` : key

		// Check if the key contains a MongoDB operator
		if (containsMongoOperatorInKey(key)) {
			changes.push(`MongoDB operator detected in key: ${currentPath}`)
			// Don't include this key in the sanitized object
			continue
		}

		// Check arrays recursively
		if (Array.isArray(value)) {
			const { sanitized: sanitizedArray, changes: arrayChanges } = sanitizeMongoArray(
				value,
				currentPath
			)
			sanitized[key] = sanitizedArray
			changes.push(...arrayChanges)
			continue
		}

		// Check objects recursively
		if (typeof value === "object" && value !== null) {
			const { sanitized: sanitizedNestedObj, changes: nestedChanges } = sanitizeMongoObject(
				value,
				currentPath
			)
			sanitized[key] = sanitizedNestedObj
			changes.push(...nestedChanges)
			continue
		}

		// Check if the value contains a MongoDB operator
		if (containsMongoOperatorInValue(value)) {
			changes.push(`MongoDB operator detected in value: ${currentPath}`)
			sanitized[key] = ""
			continue
		}

		// If all is well, keep the value
		sanitized[key] = value
	}

	return { sanitized, changes }
}

/**
 * Sanitizes an array by removing MongoDB operators
 *
 * @param {any[]} arr - Array to sanitize
 * @param {string} parentPath - Parent path in the object (for logging)
 * @returns {object} - Sanitized array and detection info
 */
const sanitizeMongoArray = (arr: any[], parentPath: string): { sanitized: any[]; changes: string[] } => {
	const sanitized: any[] = []
	const changes: string[] = []
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i]
		const currentPath = `${parentPath}[${i}]`

		// Process arrays and objects recursively
		if (Array.isArray(item)) {
			const { sanitized: sanitizedArray, changes: arrayChanges } = sanitizeMongoArray(
				item,
				currentPath
			)
			sanitized.push(sanitizedArray)
			changes.push(...arrayChanges)
			continue
		}

		if (typeof item === "object" && item !== null) {
			const { sanitized: sanitizedObj, changes: objChanges } = sanitizeMongoObject(item, currentPath)
			sanitized.push(sanitizedObj)
			changes.push(...objChanges)
			continue
		}

		// Check if the element contains a MongoDB operator
		if (containsMongoOperatorInValue(item)) {
			changes.push(`MongoDB operator detected in array value: ${currentPath}`)
			sanitized.push("")
			continue
		}

		// If all is well, keep the value
		sanitized.push(item)
	}

	return { sanitized, changes }
}

/**
 * Directly checks route parameters for MongoDB operators
 *
 * @param {object} params - Route parameters
 * @returns {object} - Sanitized params and detected changes
 */
const sanitizeRouteParams = (params: any): { sanitized: any; changes: string[] } => {
	const sanitized: any = {}
	const changes: string[] = []
	for (const key in params) {
		const value = params[key]

		// Only operate on string values
		if (typeof value === "string") {
			if (value.includes("$")) {
				const paramPath = `params.${key}`

				// Check specific MongoDB operators in the value
				if (value.includes("$ne")) {
					changes.push(`MongoDB operator $ne detected in route param: ${paramPath}`)
					sanitized[key] = ""
					continue
				}

				if (value.includes("$exists")) {
					changes.push(`MongoDB operator $exists detected in route param: ${paramPath}`)
					sanitized[key] = ""
					continue
				}

				if (
					value.includes("$gt") ||
					value.includes("$lt") ||
					value.includes("$in") ||
					value.includes("$eq")
				) {
					changes.push(`MongoDB operator detected in route param: ${paramPath}`)
					sanitized[key] = ""
					continue
				}

				// Check if any operator is in the string
				if (MONGO_OPERATORS.some((op) => value.includes(op))) {
					changes.push(`MongoDB operator detected in route param: ${paramPath}`)
					sanitized[key] = ""
					continue
				}
			}
		}

		// If no operators detected, keep the original value
		sanitized[key] = value
	}

	return { sanitized, changes }
}

/**
 * Middleware to sanitize MongoDB query inputs and protect against NoSQL injection
 * Uses a deep sanitization approach for all request objects
 *
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next middleware function
 */
export const mongoSanitizerMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
	// Use a Symbol as a property key to avoid collisions
	const SANITIZED_QUERY_SYMBOL = Symbol.for("mongoSanitizedQuery")
	const SANITIZED_BODY_SYMBOL = Symbol.for("mongoSanitizedBody")
	const SANITIZED_PARAMS_SYMBOL = Symbol.for("mongoSanitizedParams")

	const securityChanges: string[] = []

	// Sanitize query parameters
	if (req.query) {
		const { sanitized: sanitizedQuery, changes } = sanitizeMongoObject(req.query, "query")
		securityChanges.push(...changes)

		// Store the results in a non-enumerable Symbol property
		Object.defineProperty(req, SANITIZED_QUERY_SYMBOL, {
			value: sanitizedQuery,
			writable: false,
			configurable: false,
			enumerable: false,
		})

		// For compatibility with existing code
		;(req as any).sanitizedQuery = sanitizedQuery
	}

	// Sanitize request body
	if (req.body) {
		const { sanitized: sanitizedBody, changes } = sanitizeMongoObject(req.body, "body")
		securityChanges.push(...changes)

		// Store the results
		Object.defineProperty(req, SANITIZED_BODY_SYMBOL, {
			value: sanitizedBody,
			writable: false,
			configurable: false,
			enumerable: false,
		})

		// For compatibility
		;(req as any).sanitizedBody = sanitizedBody
	}

	// Sanitize route parameters - this is the part we're fixing
	if (req.params) {
		const { sanitized: sanitizedParams, changes } = sanitizeRouteParams(req.params)

		// Important fix: Add the route param changes to the security changes array
		if (changes.length > 0) {
			securityChanges.push(...changes)
		}

		// Store the results
		Object.defineProperty(req, SANITIZED_PARAMS_SYMBOL, {
			value: sanitizedParams,
			writable: false,
			configurable: false,
			enumerable: false,
		})

		// For compatibility
		;(req as any).sanitizedParams = sanitizedParams
	}

	// Add getter methods to easily access sanitized data
	if (!(req as any).getSanitizedQuery) {
		Object.defineProperty(req, "getSanitizedQuery", {
			value: function () {
				return this[SANITIZED_QUERY_SYMBOL] || {}
			},
			writable: false,
			configurable: false,
			enumerable: false,
		})
	}

	if (!(req as any).getSanitizedBody) {
		Object.defineProperty(req, "getSanitizedBody", {
			value: function () {
				return this[SANITIZED_BODY_SYMBOL] || {}
			},
			writable: false,
			configurable: false,
			enumerable: false,
		})
	}

	if (!(req as any).getSanitizedParams) {
		Object.defineProperty(req, "getSanitizedParams", {
			value: function () {
				return this[SANITIZED_PARAMS_SYMBOL] || {}
			},
			writable: false,
			configurable: false,
			enumerable: false,
		})
	}

	// Log injection attempts
	if (securityChanges.length > 0) {
		logSecurityEvent("Potential NoSQL injection attempt", req, securityChanges)
	}
	next()
}