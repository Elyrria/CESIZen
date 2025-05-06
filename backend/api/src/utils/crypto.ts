import type { IUserCreate, IUserDisplay } from "@api/types/user.d.ts"
import { dateToString, stringToDate } from "@utils/dateConverter.ts"
import type { IRefreshTokenCreate } from "@api/types/tokens.d.ts"
import { ROLE_HIERARCHY } from "@configs/role.configs.ts"
import { RefreshToken, User } from "@models/index.ts"
import { CONFIGS, CRYPTO } from "@configs/global.configs.ts"
import { FIELD } from "@configs/fields.configs.ts"
import bcrypt from "bcrypt"
import crypto from "crypto"

/**
 * Encrypts a value in a reversible way
 */

const ENCRYPTION_KEY = Buffer.from(CONFIGS.ENCRYPTION.KEY, "hex")
console.log(CRYPTO)
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

export async function processUserData(userData: IUserCreate) {
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
		role: ROLE_HIERARCHY[ROLE_HIERARCHY.length - 1],
	})

	// Later, to display the real name:
	// const realName = decrypt(user.name);

	return user
}

export async function processRefreshToken(refreshTokenData: IRefreshTokenCreate): Promise<IRefreshTokenCreate> {
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
 * Decrypts specified fields in a user object
 * @param {Record<string, any>} userData - The user data object with encrypted fields
 * @returns {Record<string, any>} - A new object with decrypted fields
 */
export function decryptData(userData: Record<string, any>, ENCRYPTED_FIELDS: string[]): any {
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
