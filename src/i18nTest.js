import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources: {}, // resources would be your translations. This can be an empty object for testing if you don't want to use actual translations.
    lng: "fr", // language to use
    fallbackLng: "fr",

    interpolation: {
      escapeValue: false, // not needed for React
    },
  });

export default i18n;
