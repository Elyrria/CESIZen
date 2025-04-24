import type { IUserDisplay } from "@api/types/user.d.ts"
import type {ITokens} from "@api/types/tokens.d.ts"
export interface IData {
	user?: IUserDisplay
	users?: IUserDisplay[]
	ressource?: IRessource
	tokens?: ITokens
	pagination?: IPagination
}
