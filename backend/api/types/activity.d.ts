import { Document, ObjectId } from "mongoose"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import mongoose from "mongoose"
export interface IActivity {
	authorId: mongoose.Types.ObjectId
	_id?: ObjectId
	name: string
	description: string
	type: (typeof MEDIATYPE)[number]
	content?: string
	isActive: boolean
	parameters?: Record<string, any>
	validatedBy?: ObjectId
	validatedAndPublishedAt?: Date
	fileId?: mongoose.Types.ObjectId
	fileMetadata?: {
		filename?: string
		contentType?: string
		size?: number
		uploadDate?: Date
		duration?: number
		dimensions?: {
			width?: number
			height?: number
		}
		encoding?: string
		bitrate?: number
	}
	categoryId: mongoose.Types.ObjectId
	createdAt?: Date
	updatedAt?: Date
}

export interface IActivityDocument extends IActivity, Document {}
