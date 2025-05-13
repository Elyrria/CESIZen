import informationSchema from "@models/Information/Information.schema.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import mongoose from "mongoose"
/**
 * Create and export the Information model
 */

const Information = mongoose.model<IInformationDocument>("Information", informationSchema)

export default Information
