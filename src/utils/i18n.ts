import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../locales/en.json";
import fr from "../../locales/fr.json";
import { getUserLanguageCode } from "./language";

const resources = {
    en: { translation: en },
    fr: { translation: fr },
};
const availableLanguages = Object.keys(resources);

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React already escapes
    },
});

(async () => {
    const userLanguage = await getUserLanguageCode();
    const targetLanguage = availableLanguages.includes(userLanguage)
        ? userLanguage
        : "en";

    console.log("Using language", targetLanguage);

    await i18n.changeLanguage(targetLanguage);
})();

i18n.on("languageChanged", (lng) => {
    // Update HTML document lang on language change
    document.documentElement.lang = lng;
});

export { i18n, availableLanguages };
