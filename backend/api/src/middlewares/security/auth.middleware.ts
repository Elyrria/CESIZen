import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE} from "@errorHandler/configs.errorHandler.ts"
import type { IDecodedToken } from "@api/types/tokens.d.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
/**
 * Middleware function to authenticate requests using JSON Web Tokens (JWT).
 *
 * This function extracts the JWT from the Authorization header, verifies it using a secret key,
 * and attaches the decoded user ID to the request object for use in subsequent middleware or route handlers.
 * If the token is invalid or missing, it responds with a 401 Unauthorized status.
 *
 */

export const auth = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authorization = req.header("authorization")
		if (!authorization) {
			errorHandler(res, ERROR_CODE.UNAUTHORIZED)
			return
		}

		const token = authorization.split(" ")[1]
		const secretKey: string | undefined = process.env.TOKEN_SECRET

		if (!secretKey) {
			throw new Error("Missing secret key")
		}
        
		const decodedToken = jwt.verify(token, secretKey) as IDecodedToken
		const userId = decodedToken.userId

		req.auth = {
			userId: userId,
		}
		next()
	} catch (error: unknown) {
		const errorType = error instanceof Error ? error.message : ERROR_CODE.SERVER
		switch (errorType) {
			case "invalid signature":
				errorHandler(res, ERROR_CODE.SIGN_TOKEN)
				break
			case "invalid token":
				errorHandler(res, ERROR_CODE.INVALID_TOKEN)
				break
			case "jwt malformed":
				errorHandler(res, ERROR_CODE.INVALID_TOKEN)
				break
			case "jwt expired":
				errorHandler(res, ERROR_CODE.EXPIRED_TOKEN)
				break
			default:
				handleUnexpectedError(res, error as Error)
		}
	}
}
