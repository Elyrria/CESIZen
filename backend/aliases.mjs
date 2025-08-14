/**
 * aliases.mjs
 *
 * This module provides a custom Node.js module resolution hook that enables
 * the use of path aliases in your project. It allows you to use shorthand import
 * paths instead of relative paths, making your code more maintainable.
 */
import { pathToFileURL } from "url"

/**
 * A mapping of alias prefixes to their corresponding file paths.
 * Each key is an alias that will be replaced with its corresponding path value.
 */
const aliases = {
	"@mongoQueryBuilders/": "./api/src/controllers/mongoQueryBuilders/",
	"@successHandler/": "./api/src/handlerResponse/successHandler/",
	"@errorHandler/": "./api/src/handlerResponse/errorHandler/",
	"@sanitizers/": "./api/src/middlewares/sanitizers/",
	"@validator/": "./api/src/middlewares/validator/",
	"@controllers/": "./api/src/controllers/",
	"@middlewares/": "./api/src/middlewares/",
	"@services/": "./api/src/services/",
	"@models/": "./api/src/models/",
	"@server/": "./api/src/server/",
	"@routes/": "./api/src/routes/",
	"@utils/": "./api/src/utils/",
	"@logs/": "./api/src/logs/",
	"@core/": "./api/src/core/",
	"@configs/": "./configs/",
	"@types/": "./api/types/",
	"@doc/": "./api/doc/",
	"@src/": "./api/src/",
	"@api/": "./api/",
}

/**
 * Custom module resolution function that implements the Node.js ESM loader hook.
 * Transforms import specifiers that begin with defined aliases into their full paths.
 *
 * @param {string} specifier - The import specifier being resolved (e.g., '@api/some-module')
 * @param {Object} context - The context information provided by Node.js
 * @param {Function} nextResolve - The next resolve function in the resolution chain
 * @returns {Promise<{url: string, ...}>} The result of calling nextResolve with the transformed specifier
 */
export const resolve = (specifier, context, nextResolve) => {
	// Check if the specifier starts with an alias
	for (const [alias, path] of Object.entries(aliases)) {
		if (specifier.startsWith(alias)) {
			// Replace the alias with its corresponding path
			const newPath = specifier.replace(alias, path)
			// Convert the path to a file:// URL
			const resolvedSpecifier = pathToFileURL(newPath).href
			return nextResolve(resolvedSpecifier, context)
		}
	}

	// If not an alias, pass to the next resolver
	return nextResolve(specifier, context)
}
