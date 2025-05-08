import { deleteObjectIds } from "@utils/idCleaner.ts"

describe("deleteObjectIds", () => {
	// Test for removing a simple ID
	it("should remove a single id field from an object", () => {
		const input = { id: "123", name: "Test" }
		const result = deleteObjectIds(input)

		expect(result).toEqual({ name: "Test" })
		expect("id" in result).toBe(false)
	})

	// Test for removing multiple types of IDs
	it("should remove all specified ID types from an object", () => {
		const input = {
			id: "123",
			_id: "456",
			userId: "789",
			uuid: "abc",
			name: "Test",
		}
		const result = deleteObjectIds(input)

		expect(result).toEqual({ name: "Test" })
		expect("id" in result).toBe(false)
		expect("_id" in result).toBe(false)
		expect("userId" in result).toBe(false)
		expect("uuid" in result).toBe(false)
	})

	// Test for absence of IDs to remove
	it("should return object unchanged when no IDs are present", () => {
		const input = { name: "Test", value: 42 }
		const result = deleteObjectIds(input)

		expect(result).toEqual(input)
	})

	// Test for preserving the original object
	it("should not modify the original object", () => {
		const original = { id: "123", name: "Test" }
		const result = deleteObjectIds(original)

		expect(original).toEqual({ id: "123", name: "Test" })
		expect(result).not.toBe(original) // Verifies it's not the same reference
	})

	// Test for handling an empty object
	it("should handle empty objects", () => {
		const input = {}
		const result = deleteObjectIds(input)

		expect(result).toEqual({})
	})

	// Test for handling nested objects
	it("should only modify top-level properties", () => {
		const input = {
			id: "123",
			nested: { id: "456", name: "Nested" },
		}
		const result = deleteObjectIds(input)

		expect(result).toEqual({
			nested: { id: "456", name: "Nested" },
		})
	})
})
