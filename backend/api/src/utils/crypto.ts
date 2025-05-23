import type { IUserCreate, IUserDisplay } from "@api/types/user.d.ts"
import { dateToString, stringToDate } from "@utils/dateConverter.ts"
import type { IRefreshTokenCreate } from "@api/types/tokens.d.ts"
import { ROLE_HIERARCHY } from "@configs/role.configs.ts"
import { RefreshToken, User } from "@models/index.ts"
import { CONFIGS, CRYPTO } from "@configs/global.configs.ts"
import { FIELD } from "@configs/fields.configs.ts"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"

/**
 * Encrypts a value in a reversible way
 */

const ENCRYPTION_KEY = Buffer.from(CONFIGS.ENCRYPTION.KEY, "hex")
if (ENCRYPTION_KEY.length !== CRYPTO.keyLength) {
	throw new Error(`Invalid encryption key length. Must be ${CRYPTO.keyLength} bytes for ${CRYPTO.algorithm}.`)
}

export function encrypt(data: string): string {
	// Generate a random IV
	const iv = crypto.randomBytes(Number(CONFIGS.IV.KEY))
	// Create the cipher
	const cipher = crypto.createCipheriv(CRYPTO.algorithm, Buffer.from(ENCRYPTION_KEY), iv)
	// Encrypt the data
	let encrypted = cipher.update(data, "utf8", "hex")
	encrypted += cipher.final("hex")
	// Return the IV and the encrypted data together (to be able to decrypt later)
	return iv.toString("hex") + ":" + encrypted
}
/**
 * Decrypts a previously encrypted value
 */
export function decrypt(data: string): string {
	// Separate the IV and the encrypted data
	const parts = data.split(":")
	const iv = Buffer.from(parts[0], "hex")
	const encryptedData = parts[1]
	// Create the decipher
	const decipher = crypto.createDecipheriv(CRYPTO.algorithm, Buffer.from(ENCRYPTION_KEY), iv)
	// Decrypt the data
	let decrypted = decipher.update(encryptedData, "hex", "utf8")
	decrypted += decipher.final("utf8")

	return decrypted
}

export async function processUserData(userData: IUserCreate, admin: boolean = false) {
	// Encrypt sensitive data
	const encryptedName: string = encrypt(userData.name)
	const encryptedFirstName: string = encrypt(userData.firstName)
	const encryptedBirthDate: string = encrypt(dateToString(userData.birthDate))
	// Hash the password (no reversible encryption for passwords!)
	const hashedPassword = await bcrypt.hash(userData.password, 10)
	// Store this data in the database
	const user = new User({
		email: userData.email,
		password: hashedPassword,
		name: encryptedName,
		firstName: encryptedFirstName,
		birthDate: encryptedBirthDate,
		role: (admin = false ? ROLE_HIERARCHY[ROLE_HIERARCHY.length - 1] : userData.role),
	})

	// Later, to display the real name:
	// const realName = decrypt(user.name);

	return user
}

/**
 * Process user data for updates, encrypting sensitive fields
 * @param userData - User data to update
 * @returns Processed user data with encrypted fields
 */
export async function processUserUpdateData(userData: Partial<IUserCreate>): Promise<Record<string, any>> {
	const processedData: Record<string, any> = {}

	// Process only fields that are present in the update
	if (userData.name !== undefined) {
		processedData.name = encrypt(userData.name)
	}

	if (userData.firstName !== undefined) {
		processedData.firstName = encrypt(userData.firstName)
	}

	if (userData.birthDate !== undefined) {
		processedData.birthDate = encrypt(dateToString(userData.birthDate))
	}

	// Copy other non-sensitive fields without modification
	const nonSensitiveFields = ["email", "role", "password"]
	for (const field of nonSensitiveFields) {
		const key = field as keyof Partial<IUserCreate>
		if (userData[key] !== undefined) {
			processedData[field] = userData[key]
		}
	}

	return processedData
}

export async function processRefreshToken(refreshTokenData: IRefreshTokenCreate): Promise<IRefreshTokenCreate> {
	
	if (!mongoose.Types.ObjectId.isValid(refreshTokenData.userId)) {
		throw new Error("Invalid MongoDB ID format")
	}
	
	const encryptedIp: string = encrypt(refreshTokenData.ipAddress)
	const encryptedUserAgent: string = encrypt(refreshTokenData.userAgent)
	const refreshToken = new RefreshToken({
		refreshToken: refreshTokenData.refreshToken,
		userId: refreshTokenData.userId,
		ipAddress: encryptedIp,
		userAgent: encryptedUserAgent,
	})

	return refreshToken
}
/**
 * Decrypts sensitive data in a user object or an array of user objects.
 * 
 * This function handles both single user objects and arrays of users, applying
 * decryption to specified fields. It preserves the original structure of the input
 * and handles special cases like date conversion for birth dates.
 * 
 * @param userData - A single user object or an array of user objects to decrypt
 * @param ENCRYPTED_FIELDS - Array of field names that need to be decrypted
 * @returns The decrypted user data in the same structure as the input (single object or array)
 */
export function decryptData(userData: Record<string, any> | Record<string, any>[], ENCRYPTED_FIELDS: string[]): any {
  // If userData is an array
  if (Array.isArray(userData)) {
    // Process each user in the array
    return userData.map(user => decryptSingleUser(user, ENCRYPTED_FIELDS));
  } else {
    // Process a single user
    return decryptSingleUser(userData, ENCRYPTED_FIELDS);
  }
}

/**
 * Decrypts specified fields in a user object
 * @param {Record<string, any>} userData - The user data object with encrypted fields
 * @returns {Record<string, any>} - A new object with decrypted fields
 */
export function decryptSingleUser(userData: Record<string, any>, ENCRYPTED_FIELDS: string[]): any {
	// Create a copy of the original object to avoid modifying it
	const decryptedUser = { ...userData }

	// Loop through each key in the object
	for (const key in decryptedUser) {
		// Check if this field should be decrypted
		if (ENCRYPTED_FIELDS.includes(key) && typeof decryptedUser[key] === "string") {
			try {
				// Attempt to decrypt the field
				decryptedUser[key] = decrypt(decryptedUser[key])
				if (key === FIELD.BIRTH_DATE) {
					decryptedUser[key] = stringToDate(decryptedUser[key])
				}
			} catch (error) {
				// Handle decryption errors gracefully
				console.error(`Failed to decrypt ${key}:`, error)
				// Keep the encrypted value or set a placeholder
				decryptedUser[key] = `[Encrypted ${key}]`
			}
		}
	}

	return decryptedUser as IUserDisplay
}
