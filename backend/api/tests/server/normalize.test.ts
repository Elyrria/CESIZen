import { normalize } from "@server/normalize.ts"

describe("normalize", () => {
	// Test for valid numeric port conversion
	it("should return the correct port number when the input is a valid numeric string", () =>
		expect(normalize("4550")).toBe(4550))

	// Test for handling non-numeric inputs
	it("should return the original string if the input is not a valid number", () =>
		expect(normalize("abc")).toBe("abc"))

	// Test for proper error handling with negative values
	it("should throw an error if the input is <= 0", () => {
		expect(() => normalize("-1")).toThrow("Value cannot be ≤ to 0: -1")
	})
	// Edge case: minimum valid port
	it("should accept the value 1 as valid", () => {
		expect(normalize("1")).toBe(1)
	})

	// Test handling of decimal numbers
	it("should truncate decimal numbers", () => {
		expect(normalize("45.67")).toBe(45)
	})

	// Test handling of mixed strings that start with numbers
	it("should parse the beginning of mixed strings", () => {
		expect(normalize("123abc")).toBe(123)
	})

	// Test for empty strings
	it("should handle empty strings", () => {
		expect(normalize("")).toBe("")
	})

	// Test for zero value
	it("should throw an error if the input is 0", () => {
		// Using the alternative approach with a more specific matcher
		expect(() => normalize("0")).toThrow()
		expect(() => normalize("0")).toThrow(Error)
		expect(() => normalize("0")).toThrow("Value cannot be ≤ to 0: 0")
	})
})
