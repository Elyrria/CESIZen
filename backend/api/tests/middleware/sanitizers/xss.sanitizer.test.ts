import { sanitizeString, deepXssSanitize } from "@middlewares/sanitizers/xss.sanitizer.ts"

describe("XSS Sanitizer Utils", () => {
	// Tests pour sanitizeString
	describe("sanitizeString", () => {
		it("should sanitize strings with script tags", () => {
			const input = "<script>alert('XSS')</script>Bonjour"
			const { result, changed } = sanitizeString(input)

			expect(result).not.toContain("<script>")
			expect(changed).toBe(true)
		})

		it("should sanitize strings with javascript in attributes", () => {
			const input = '<img src="x" onerror="alert(\'XSS\')">'
			const { result, changed } = sanitizeString(input)

			expect(result).not.toContain("onerror")
			expect(changed).toBe(true)
		})

		it("should not modify clean strings", () => {
			const input = "Bonjour, comment allez-vous?"
			const { result, changed } = sanitizeString(input)

			expect(result).toBe(input)
			expect(changed).toBe(false)
		})

		it("should handle non-string inputs", () => {
			const input = 123
			const { result, changed } = sanitizeString(input as any)

			expect(result).toBe(input)
			expect(changed).toBe(false)
		})
	})

	// Tests pour deepXssSanitize
	describe("deepXssSanitize", () => {
		it("should sanitize objects with XSS in string properties", () => {
			const input = {
				name: "User",
				description: "<script>alert('XSS')</script>",
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.description).not.toContain("<script>")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("XSS content detected")
		})

		it("should sanitize nested objects with XSS", () => {
			const input = {
				user: {
					name: "User",
					bio: "<img src='x' onerror='alert(\"XSS\")'>",
				},
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.user.bio).not.toContain("onerror")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("user.bio")
		})

		it("should sanitize arrays with XSS", () => {
			const input = ["normal text", "<script>alert('XSS')</script>", 123]
			const { result, changes } = deepXssSanitize(input)

			expect(result[1]).not.toContain("<script>")
			expect(changes.length).toBe(1)
		})

		it("should sanitize objects with arrays containing XSS", () => {
			const input = {
				name: "User",
				comments: ["Good article", "<iframe src='javascript:alert(\"XSS\")'></iframe>"],
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.comments[1]).not.toContain("<iframe")
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("comments.1")
		})

		it("should handle null values", () => {
			const input = null
			const { result, changes } = deepXssSanitize(input)

			expect(result).toBe(null)
			expect(changes.length).toBe(0)
		})

		it("should handle undefined values", () => {
			const input = undefined
			const { result, changes } = deepXssSanitize(input)

			expect(result).toBe(undefined)
			expect(changes.length).toBe(0)
		})

		it("should sanitize objects with multiple XSS attempts", () => {
			const input = {
				name: "<script>alert('Name')</script>",
				description: "<img src='x' onerror='alert(\"Description\")'>",
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.name).not.toContain("<script>")
			expect(result.description).not.toContain("onerror")
			expect(changes.length).toBe(2)
		})

		it("should not modify objects without XSS content", () => {
			const input = {
				name: "User",
				age: 30,
				address: {
					street: "123 Main St",
					city: "Paris",
				},
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result).toEqual(input)
			expect(changes.length).toBe(0)
		})

		it("should handle complex nested structures", () => {
			const input = {
				users: [
					{
						name: "User1",
						comments: ["Nice", "<script>alert('XSS')</script>"],
					},
					{
						name: "<img src='x' onerror='alert(\"XSS\")'>",
					},
				],
			}
			const { result, changes } = deepXssSanitize(input)

			expect(result.users[0].comments[1]).not.toContain("<script>")
			expect(result.users[1].name).not.toContain("onerror")
			expect(changes.length).toBe(2)
		})
	})
})
