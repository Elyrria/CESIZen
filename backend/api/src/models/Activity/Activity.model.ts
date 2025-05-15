import activitySchema from "@models/Activity/Activity.schema.ts"
import type { IActivityDocument } from "@api/types/activity.d.ts"
import mongoose from "mongoose"
/**
 * Create and export the Activity model
 */
const Activity = mongoose.model<IActivityDocument>("Activity", activitySchema)

export default Activity
