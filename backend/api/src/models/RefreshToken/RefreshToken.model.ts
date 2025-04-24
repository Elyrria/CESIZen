import type { IRefreshToken } from "@models/RefreshToken/RefreshToken.interface.ts"
import {refreshTokenSchema} from "@models/RefreshToken/RefreshToken.schema.ts"
import mongoose from "mongoose"

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)

export default RefreshToken
