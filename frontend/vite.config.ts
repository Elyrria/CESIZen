import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// Frontend aliases
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@layouts": path.resolve(__dirname, "./src/layouts"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@store": path.resolve(__dirname, "./src/store"),
			"@factories": path.resolve(__dirname, "./src/factories"),
			"@types": path.resolve(__dirname, "./src/types"),
			"@configs": path.resolve(__dirname, "./src/configs"),
		},
	},
})
