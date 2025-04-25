import refreshTokenSchema from "@models/RefreshToken/RefreshToken.schema.ts"
import type { IRefreshTokenDocument } from "@api/types/tokens.d.ts"
import mongoose from "mongoose"

const RefreshToken = mongoose.model<IRefreshTokenDocument>("RefreshToken", refreshTokenSchema)

export default RefreshToken
