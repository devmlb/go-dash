import { locale } from "@tauri-apps/plugin-os";

async function getUserLanguageCode(): Promise<string> {
    try {
        const systemLocale = await locale();
        console.log("Detected system locale", systemLocale);

        if (systemLocale) {
            // Extract the language code (e.g., "en-US" -> "en")
            const parts = systemLocale.split("-");
            const langCode = (parts[0] ?? "en").toLowerCase();

            return langCode;
        }

        // Fallback to English
        throw new Error("fallback");
    } catch (e) {
        console.error("Failed to detect language, fallback to english", e);
        return "en";
    }
}

export { getUserLanguageCode };
