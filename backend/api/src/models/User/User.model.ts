import type { IUserDocument } from "@api/types/user.d.ts"
import userSchema from "@models/User/User.schema.ts"
import mongoose from "mongoose"
/**
 * Create and export the User model
 */
const User = mongoose.model<IUserDocument>("User", userSchema)

export default User
