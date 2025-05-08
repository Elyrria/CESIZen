import { hasRoleAccess, isValidRole } from "@utils/hasRoleAccess.ts"
import { ROLES } from "@configs/role.configs.ts"

describe("isValidRole", () => {
	// Test for administrator role
	it("should return true for administrator role", () => {
		expect(isValidRole("administrator")).toBe(true)
	})

	// Test for user role
	it("should return true for user role", () => {
		expect(isValidRole("user")).toBe(true)
	})

	// Test for an invalid role
	it("should return false for an invalid role", () => {
		expect(isValidRole("guest")).toBe(false)
		expect(isValidRole("")).toBe(false)
		expect(isValidRole("moderator")).toBe(false)
	})

	// Test for case sensitivity
	it("should be case sensitive", () => {
		expect(isValidRole("Administrator")).toBe(false)
		expect(isValidRole("USER")).toBe(false)
	})
})

describe("hasRoleAccess", () => {
	// Test for admin accessing admin features
	it("should return true when admin accesses admin features", () => {
		expect(hasRoleAccess(ROLES.ADMIN, ROLES.ADMIN)).toBe(true)
	})

	// Test for user accessing user features
	it("should return true when user accesses user features", () => {
		expect(hasRoleAccess(ROLES.REGISTERED_USER, ROLES.REGISTERED_USER)).toBe(true)
	})

	// Test for admin accessing user features
	it("should return true when admin accesses user features", () => {
		expect(hasRoleAccess(ROLES.ADMIN, ROLES.REGISTERED_USER)).toBe(true)
	})

	// Test for user trying to access admin features
	it("should return false when user tries to access admin features", () => {
		expect(hasRoleAccess(ROLES.REGISTERED_USER, ROLES.ADMIN)).toBe(false)
	})

	// Test for an invalid user role
	it("should return false when user role is not in hierarchy", () => {
		expect(hasRoleAccess("guest", ROLES.REGISTERED_USER)).toBe(false)
	})

	// Test for an invalid required role
	it("should return false when required role is not in hierarchy", () => {
		expect(hasRoleAccess(ROLES.ADMIN, "moderator")).toBe(false)
	})

	// Test for both roles being invalid
	it("should return false when both roles are invalid", () => {
		expect(hasRoleAccess("guest", "moderator")).toBe(false)
	})
})
