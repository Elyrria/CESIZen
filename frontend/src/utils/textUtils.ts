// src/utils/textUtils.ts
export const cleanText = (text: string | undefined | null): string => {
	if (!text) return ""

	const textarea = document.createElement("textarea")
	textarea.innerHTML = text
	return textarea.value
}
