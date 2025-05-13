import type { IUserDisplay } from "@api/types/user.d.ts"
import type { ITokens } from "@api/types/tokens.d.ts"
import type { IInformation } from "@api/types/information.d.ts"
export interface IData {
	user?: IUserDisplay
	users?: IUserDisplay[]
	information?: IInformation
	tokens?: ITokens
	pagination?: IPagination
}
