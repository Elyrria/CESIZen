// aliases.mjs
import { pathToFileURL } from "url"

// Définissez vos alias ici
export const resolve = (specifier, context, nextResolve) => {
	const aliases = {
		"@api/": "./api/",
		"@src/": "./api/src/",
		"@controllers/": "./api/src/controllers/",
		"@middlewares/": "./api/src/middlewares/",
		"@models/": "./api/src/models/",
		"@routes/": "./api/src/routes/",
		"@utils/": "./api/src/utils/",
		"@configs/": "./configs/",
		"@types/": "./types/",
	}

	// Vérifie si le spécificateur commence par un alias
	for (const [alias, path] of Object.entries(aliases)) {
		if (specifier.startsWith(alias)) {
			// Remplace l'alias par son chemin
			const newPath = specifier.replace(alias, path)
			// Convertit le chemin en URL file://
			const resolvedSpecifier = pathToFileURL(newPath).href
			return nextResolve(resolvedSpecifier, context)
		}
	}

	// Si ce n'est pas un alias, passe au résolveur suivant
	return nextResolve(specifier, context)
}
