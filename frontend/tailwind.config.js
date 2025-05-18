/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				marianne: ["Marianne", "sans-serif"],
			},
			colors: {
				// Couleurs officielles du DSFR (Système de Design de l'État)
				"fr-blue": "#000091",
				"fr-blue-light": "#E3E3FD",
				"fr-red": "#E1000F",
				"fr-red-light": "#F4E3E5",
				"fr-white": "#FFFFFF",
				"fr-black": "#161616",
				"fr-grey": "#666666",
				"fr-grey-light": "#F5F5FE",
				"fr-grey-dark": "#3A3A3A",
				"fr-success": "#18753C",
				"fr-success-light": "#B8FEC9",
				"fr-warning": "#D64D00",
				"fr-warning-light": "#FFE9E9",
				"fr-info": "#0063CB",
				"fr-info-light": "#E8EDFF",
			},
			spacing: {
				// Espacements standards DSFR
				"fr-1v": "0.25rem", // 4px
				"fr-2v": "0.5rem", // 8px
				"fr-3v": "0.75rem", // 12px
				"fr-4v": "1rem", // 16px
				"fr-5v": "1.25rem", // 20px
				"fr-6v": "1.5rem", // 24px
				"fr-7v": "1.75rem", // 28px
				"fr-8v": "2rem", // 32px
			},
			borderRadius: {
				"fr-sm": "0.25rem", // 4px
				"fr-md": "0.5rem", // 8px
				"fr-lg": "0.75rem", // 12px
			},
			boxShadow: {
				"fr-sm": "0 1px 4px 0 rgba(0, 0, 0, 0.1)",
				"fr-md": "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
				"fr-lg": "0 6px 24px 0 rgba(0, 0, 0, 0.12)",
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				cesizen: {
					// Utilisation des couleurs DSFR pour le thème DaisyUI
					primary: "#000091", // Bleu DSFR
					"primary-content": "#FFFFFF",
					secondary: "#E3E3FD", // Bleu clair DSFR
					"secondary-content": "#000091",
					accent: "#E1000F", // Rouge DSFR
					"accent-content": "#FFFFFF",
					neutral: "#F5F5FE", // Gris très clair DSFR
					"neutral-content": "#161616",
					"base-100": "#FFFFFF",
					"base-200": "#F6F6F6",
					"base-300": "#E7E7E7",
					"base-content": "#161616",
					info: "#0063CB",
					success: "#18753C",
					warning: "#D64D00",
					error: "#E1000F",
				},
			},
			"light",
		],
	},
}
