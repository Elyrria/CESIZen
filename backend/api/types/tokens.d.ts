import { type IUser } from "@api/types/user.d.ts"
import { type Role } from "@configs/role.configs.ts"

export interface ITokens {
	accessToken: string
	refreshToken: string
}

export interface IDecodedToken {
	userId: string
	role: Role
}

export interface IUserToken extends Pick<IUser, "role"> {
	id: string
}
