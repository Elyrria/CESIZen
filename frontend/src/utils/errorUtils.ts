// src/utils/errorUtils.ts
import type { UseFormSetError, Path, FieldValues } from "react-hook-form"
import { toast } from "react-toastify"
import type { IApiErrorResponse } from "@/services/apiHandler"

/**
 * Utility to handle backend validation errors
 * and map them to the corresponding form fields
 */
export const handleValidationErrors = <T extends FieldValues>(
	response: IApiErrorResponse,
	setError: UseFormSetError<T>,
	validFields: Path<T>[],
	customFieldMessages?: Record<string, string>
) => {
	// Check if there are field-specific validation errors
	if (response.error?.errors && response.error.errors.length > 0) {
		let hasFieldErrors = false

		response.error.errors.forEach((fieldError) => {
			if (fieldError.field) {
				// Check if the field exists in valid fields
				const fieldName = fieldError.field as string
				const validField = validFields.find((field) => field === fieldName)

				if (validField) {
					setError(
						validField,
						{
							message: fieldError.message,
						},
						{ shouldFocus: !hasFieldErrors }
					) // Focus only on the first error
					hasFieldErrors = true
				} else {
					// For unmapped fields or general errors
					const customMessage = customFieldMessages?.[fieldError.field]
					if (customMessage) {
						toast.error(customMessage)
					} else {
						toast.error(fieldError.message)
					}
				}
			}
		})

		return hasFieldErrors
	}

	// No specific field errors found
	return false
}

/**
 * Handles API errors and returns an appropriate error message
 */
export const getApiErrorMessage = (response: IApiErrorResponse, defaultMessage: string): string => {
	return response.error?.message || defaultMessage
}
