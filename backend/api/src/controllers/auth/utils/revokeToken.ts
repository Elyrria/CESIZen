import type { IRefreshTokenDocument } from "@api/types/tokens.js"
/**
 * Helper function to revoke a token
 */
export async function revokeToken(token: IRefreshTokenDocument): Promise<void> {
	token.revokeToken()
	await token.save()
}
