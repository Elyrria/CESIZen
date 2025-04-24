import type {IData} from "@api/types/data.d.ts"
// Types for error constants
export interface IErrorInfo {
	code: string
	message: string
	statusCode: number
	location?: string
}

interface ErrorDataItem {
	code?: string
	location?: string
	message?: string
	path?: string
	type?: string
	errors?: unknown
}

type ErrorData = ErrorDataItem | ErrorDataItem[]

//  Interface for success response information
export interface ISuccessInfo {
	code: string
	message: string
	statusCode: number
}

/**
 * Interface for success response data
 */
export interface ISuccessResponseData {
	code: string
	message: string
	data?: IData
}