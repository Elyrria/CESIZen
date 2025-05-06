import { dateToString, stringToDate } from "@utils/dateConverter.ts"

describe("dateToString", () => {
	// Test for Date objects
	it("should convert a Date object to ISO string", () => {
		const testDate = new Date(2023, 5, 15, 10, 30, 0) // June 15, 2023 10:30:00
		const result = dateToString(testDate)
		expect(result).toBe(testDate.toISOString())
	})

	// Test for valid string dates
	it("should return the string as is if it's a valid date", () => {
		const dateStr = "2023-06-15T10:30:00.000Z"
		const result = dateToString(dateStr)
		expect(result).toBe(dateStr)
	})

	// Test for invalid string dates
	it("should return the string as is if it's not a valid date", () => {
		const invalidStr = "this is not a date"
		const result = dateToString(invalidStr)
		expect(result).toBe(invalidStr)
	})

	// Test for numbers (timestamps)
	it("should convert a timestamp to ISO string", () => {
		const timestamp = 1623752400000 // equivalent to a specific date
		const result = dateToString(timestamp)
		expect(result).toBe(new Date(timestamp).toISOString())
	})

	// Test for undefined
	it("should return an empty string for undefined", () => {
		const result = dateToString(undefined)
		expect(result).toBe("")
	})

	// Test for null
	it("should return an empty string for null", () => {
		// @ts-ignore - Ignoring TypeScript error as we're explicitly testing null
		const result = dateToString(null)
		expect(result).toBe("")
	})
})

describe("stringToDate", () => {
	// Silence console warnings during tests
	let originalConsoleWarn: typeof console.warn

	beforeEach(() => {
		// Store the original console.warn method
		originalConsoleWarn = console.warn
		// Replace it with a jest mock function
		console.warn = jest.fn()
	})

    afterEach(() => {
		// Restore the original console.warn after each test
		console.warn = originalConsoleWarn
    })
    
	// Test for a valid date string
	it("should convert a valid date string to Date object", () => {
		const dateStr = "2023-06-15T10:30:00.000Z"
		const result = stringToDate(dateStr)
		expect(result instanceof Date).toBe(true)
		expect((result as Date).toISOString()).toBe(dateStr)
	})

	// Test for an invalid date string
	it("should return the original string for an invalid date", () => {
		const invalidStr = "this is not a date"
		const result = stringToDate(invalidStr)
		expect(result).toBe(invalidStr)
	})

	// Test for an empty string
	it("should return the empty string for an empty input", () => {
		const result = stringToDate("")
		expect(result).toBe("")
	})

	// Test with different date formats
	it("should handle different valid date formats", () => {
		const formats = ["2023-06-15", "06/15/2023", "June 15, 2023"]

		formats.forEach((format) => {
			const result = stringToDate(format)
			expect(result instanceof Date).toBe(true)
		})
	})

	// Test for error handling
	it("should handle errors and return the original string", () => {
		// Simulate an error by temporarily modifying Date
		const originalDate = global.Date
		// @ts-ignore - To simulate erroneous behavior
		global.Date = function () {
			throw new Error("Date error")
		}

		const result = stringToDate("2023-06-15")
		expect(result).toBe("2023-06-15")

		// Restore Date
		global.Date = originalDate
	})
})
