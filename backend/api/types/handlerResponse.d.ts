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
	msg?: string
	path?: string
	type?: string
	errors?: unknown
}

type ErrorData = ErrorDataItem | ErrorDataItem[]
