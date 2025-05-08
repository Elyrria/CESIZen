import {
	stringContainsMongoOperator,
	containsMongoOperatorInKey,
	containsMongoOperatorInValue,
	sanitizeMongoObject,
	sanitizeMongoArray,
	sanitizeRouteParams,
} from "@middlewares/sanitizers/mongo.sanitizer.ts"

describe("MongoDB Sanitizer Utils", () => {
	// Tests for stringContainsMongoOperator
	describe("stringContainsMongoOperator", () => {
		it("should return true when string contains a MongoDB operator", () => {
			expect(stringContainsMongoOperator("field$eq: 'value'")).toBe(true)
			expect(stringContainsMongoOperator("check if $ne: null")).toBe(true)
			expect(stringContainsMongoOperator("using the $in operator")).toBe(true)
		})

		it("should return false when string does not contain MongoDB operators", () => {
			expect(stringContainsMongoOperator("normal string")).toBe(false)
			expect(stringContainsMongoOperator("cash value is $50")).toBe(false)
			expect(stringContainsMongoOperator("")).toBe(false)
		})

		it("should return false for non-string inputs", () => {
			expect(stringContainsMongoOperator(null as any)).toBe(false)
			expect(stringContainsMongoOperator(undefined as any)).toBe(false)
			expect(stringContainsMongoOperator(123 as any)).toBe(false)
		})
	})

	// Tests for containsMongoOperatorInKey
	describe("containsMongoOperatorInKey", () => {
		it("should detect keys starting with $", () => {
			expect(containsMongoOperatorInKey("$eq")).toBe(true)
			expect(containsMongoOperatorInKey("$where")).toBe(true)
		})

		it("should detect field[$operator] patterns", () => {
			expect(containsMongoOperatorInKey("field[$eq]")).toBe(true)
			expect(containsMongoOperatorInKey("name[$regex]")).toBe(true)
		})

		it("should detect dot notation with operators", () => {
			expect(containsMongoOperatorInKey("user.preferences.$all")).toBe(true)
			expect(containsMongoOperatorInKey("items.tags[$in]")).toBe(true)
		})

		it("should return false for safe keys", () => {
			expect(containsMongoOperatorInKey("name")).toBe(false)
			expect(containsMongoOperatorInKey("user.profile")).toBe(false)
			expect(containsMongoOperatorInKey("price$value")).toBe(false)
		})
	})

	// Tests for containsMongoOperatorInValue
	describe("containsMongoOperatorInValue", () => {
		it("should detect MongoDB operators in strings", () => {
			expect(containsMongoOperatorInValue("$ne")).toBe(true)
			expect(containsMongoOperatorInValue("check $exists value")).toBe(true)
		})

		it("should detect operators in JSON strings", () => {
			expect(containsMongoOperatorInValue('{"$eq": 100}')).toBe(true)
			expect(containsMongoOperatorInValue('[{"field": {"$ne": null}}]')).toBe(true)
		})

		it("should detect operators in objects", () => {
			expect(containsMongoOperatorInValue({ $gt: 50 })).toBe(true)
			expect(containsMongoOperatorInValue({ price: { $lt: 100 } })).toBe(true)
		})

		it("should return false for safe values", () => {
			expect(containsMongoOperatorInValue("normal text")).toBe(false)
			expect(containsMongoOperatorInValue(123)).toBe(false)
			expect(containsMongoOperatorInValue({ price: 100 })).toBe(false)
			expect(containsMongoOperatorInValue('{"price": 50}')).toBe(false)
		})
	})

	// Tests for sanitizeMongoObject
	describe("sanitizeMongoObject", () => {
		it("should sanitize objects with MongoDB operators in keys", () => {
			const input = { name: "John", $where: "func()", age: 30 }
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({ name: "John", age: 30 })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in key")
		})

		it("should sanitize objects with MongoDB operators in values", () => {
			const input = { name: "John", query: "$ne: null", age: 30 }
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({ name: "John", query: "", age: 30 })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in value")
		})

		it("should sanitize nested objects recursively", () => {
			const input = {
				name: "John",
				preferences: {
					$or: [{ type: "food" }, { type: "drink" }],
					color: "blue",
				},
			}
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({
				name: "John",
				preferences: {
					color: "blue",
				},
			})
			expect(changes.length).toBe(1)
		})

		it("should sanitize objects with arrays", () => {
			const input = {
				name: "John",
				tags: ["normal", "$where: func()", "safe"],
			}
			const { sanitized, changes } = sanitizeMongoObject(input)

			expect(sanitized).toEqual({
				name: "John",
				tags: ["normal", "", "safe"],
			})
			expect(changes.length).toBe(1)
		})

		it("should return empty object for null or undefined input", () => {
			const { sanitized: sanitized1, changes: changes1 } = sanitizeMongoObject(null)
			const { sanitized: sanitized2, changes: changes2 } = sanitizeMongoObject(undefined)

			expect(sanitized1).toEqual({})
			expect(sanitized2).toEqual({})
			expect(changes1.length).toBe(0)
			expect(changes2.length).toBe(0)
		})
	})

	// Tests for sanitizeMongoArray
	describe("sanitizeMongoArray", () => {
		it("should sanitize arrays with MongoDB operators", () => {
			const input = ["normal", "$eq", 123, "safe"]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual(["normal", "", 123, "safe"])
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator detected in array value")
		})

		it("should sanitize nested arrays recursively", () => {
			const input = ["normal", ["$ne", "ok"], "safe"]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual(["normal", ["", "ok"], "safe"])
			expect(changes.length).toBe(1)
		})

		it("should sanitize arrays containing objects", () => {
			const input = [{ name: "John" }, { $where: "function()" }, { age: 30 }]
			const { sanitized, changes } = sanitizeMongoArray(input, "path")

			expect(sanitized).toEqual([{ name: "John" }, {}, { age: 30 }])
			expect(changes.length).toBe(1)
		})

		it("should handle empty arrays", () => {
			const { sanitized, changes } = sanitizeMongoArray([], "path")

			expect(sanitized).toEqual([])
			expect(changes.length).toBe(0)
		})
	})

	// Tests for sanitizeRouteParams
	describe("sanitizeRouteParams", () => {
		it("should sanitize route parameters containing MongoDB operators", () => {
			const input = { id: "123", query: "$ne: null" }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual({ id: "123", query: "" })
			expect(changes.length).toBe(1)
			expect(changes[0]).toContain("MongoDB operator $ne detected in route param")
		})

		it("should detect specific MongoDB operators in route params", () => {
			const input = {
				id: "123",
				exists: "$exists:true",
				compare: "$gt:50",
				eq: "$eq:value",
				items: "$in:[1,2,3]",
			}
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual({
				id: "123",
				exists: "",
				compare: "",
				eq: "",
				items: "",
			})
			expect(changes.length).toBe(4)
		})

		it("should not sanitize route parameters without MongoDB operators", () => {
			const input = { id: "123", name: "John", amount: "$50" }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual(input)
			expect(changes.length).toBe(0)
		})

		it("should handle non-string values in route parameters", () => {
			const input = { id: 123, active: true }
			const { sanitized, changes } = sanitizeRouteParams(input)

			expect(sanitized).toEqual(input)
			expect(changes.length).toBe(0)
		})
	})
})
