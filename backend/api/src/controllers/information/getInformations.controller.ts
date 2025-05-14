import { getPaginationOptions } from "@mongoQueryBuilders/paginationOptions.ts"
import { buildInformationQuery } from "@mongoQueryBuilders/queryUserBuilder.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { Information } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Get all information entries with pagination and filtering
 * @route GET /api/v1/informations
 * @access Public
 */
export const getAllInformations = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info(`Récupération des informations avec filtres: ${JSON.stringify(req.query)}`)

		// Étape 1: Obtenir les options de pagination
		const { page, limit, skip, sortOptions } = getPaginationOptions(req)
		logger.info(`Pagination: page=${page}, limit=${limit}, skip=${skip}`)

		// Étape 2: Construire la requête de filtrage
		const query = buildInformationQuery(req)
		logger.info(`Requête de filtrage: ${JSON.stringify(query)}`)

		// Étape 3: Exécuter la requête pour récupérer les données
		const informations = await Information.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)

		logger.info(`${chalk.green(informations.length)} informations trouvées`)

		// Étape 4: Compter le nombre total de documents pour la pagination
		const total = await Information.countDocuments(query)
		logger.info(`Total ${chalk.green(total)} informations correspondent aux critères`)

		// Étape 5: Calculer les métadonnées de pagination
		const totalPages = Math.ceil(total / limit)

		// Étape 6: Ajouter les URLs des médias pour l'affichage
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedInfos = informations.map((info) => {
			const infoObj = info.toObject()

			// Ajouter l'URL du média si c'est une IMAGE ou VIDEO
			if (["IMAGE", "VIDEO"].includes(info.type) && info.fileId) {
				infoObj.mediaUrl = `${baseUrl}/api/v1/media/${info._id}`

				// Pour les vidéos, utiliser une image par défaut pour la prévisualisation
				if (info.type === "VIDEO") {
					infoObj.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
				}
			} else if (info.type === "TEXT") {
				// Image par défaut pour le texte
				infoObj.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
			}

			return infoObj
		})

		// Étape 7: Préparer la réponse
		const responseData = {
			data: transformedInfos,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems: total,
				itemsPerPage: limit,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
			filters: req.query,
		}

		// Étape 8: Envoyer la réponse
		successHandler(res, SUCCESS_CODE.INFORMATION_LIST, responseData)
	} catch (error: unknown) {
		logger.error(`Erreur lors de la récupération des informations: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}
