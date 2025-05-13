// src/controllers/information.controller.ts
import { validateRequierdInformationFields } from "@utils/validateRequiredFields.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import { checkUserActive } from "@controllers/utils/checkUserActive.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import { uploadToGridFS } from "@services/gridfs.services.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import { Information } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import { Response } from "express"
import mongoose from "mongoose"
import sharp from "sharp"
import chalk from "chalk"

export const createInformation = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Vérification d'authentification
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}

		const user = await checkUserActive(req.auth.userId, res)
		if (!user) return

		const informationObject = req.body
		const cleanInformationObject = deleteObjectIds(informationObject)

		if (!validateRequierdInformationFields(cleanInformationObject)) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}

		const { title, description, name, type, status = STATUS[0], content } = cleanInformationObject

		// Vérifie que le type est correct
		if (!MEDIATYPE.includes(type)) {
			errorHandler(res, ERROR_CODE.INVALID_INFORMATION_TYPE)
			return
		}

		// Initialise l'objet information
		const informationData: Partial<IInformationDocument> = {
			authorId: new mongoose.Types.ObjectId(req.auth.userId),
			title,
			description,
			name,
			type,
			status,
		}

		// Contenu texte requis
		if (type === MEDIATYPE[0]) {
			if (!content) {
				errorHandler(res, ERROR_CODE.CONTENT_REQUIRED)
				return
			}
			informationData.content = content
		}

		// Cas MEDIA : fichier requis
		if (type !== MEDIATYPE[0]) {
			const file = req.file
			if (!file) {
				errorHandler(res, ERROR_CODE.FILE_REQUIRED)
				return
			}

			let fileMetadata: Record<string, any> = {}

			if (type === "IMAGE") {
				try {
					const imageInfo = await sharp(file.buffer).metadata()
					fileMetadata = {
						dimension: {
							width: imageInfo.width,
							height: imageInfo.height,
						},
						format: imageInfo.format,
					}
				} catch (error) {
					logger.error(`Erreur lors de l'extraction des métadonnées de l'image:`, error)
				}
			}

			logger.info(`Début de l'upload vers GridFS: ${chalk.blue(file.originalname)}`)
			const fileId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype, {
				type,
				createdBy: req.auth.userId,
				...fileMetadata,
			})
			logger.info(`Upload réussi, ID: ${chalk.green(fileId.toString())}`)

			informationData.fileId = fileId
			informationData.fileMetadata = {
				filename: file.originalname,
				contentType: file.mimetype,
				size: file.size,
				uploadDate: new Date(),
				...fileMetadata,
			}
		}

		const information = await new Information(informationData).save()
		logger.info(`Information créée: ${chalk.green(information._id.toString())} (Type: ${chalk.blue(type)})`)

		createdHandler(res, SUCCESS_CODE.INFORMATION_CREATED, { information })
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
	}
}
