import i18n from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import { resources } from "./resources/resources";
export const LANGS = ["en", "sv", "es", "fr", "de", "pt", "eu", "it", "nl", "pl", "ru", "ja", "zh", "ko", "ar", "hi"];

i18n.use(I18nextBrowserLanguageDetector).use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: LANGS,
  interpolation: { escapeValue: false },
  resources,
  nonExplicitSupportedLngs: true,
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"], // remembers the user's choice
  }
});
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
