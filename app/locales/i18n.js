import { default as i18n, default as I18n } from "i18n-js";
import memoize from "lodash.memoize";
import { getSavedTranslation } from "../utils/AsyncStorageHelper";
import { debugLog } from "../utils/EDConstants";

const getLocalTranslations = {
  en: () => require("../locales/en_new.json"),
  fr: () => require("../locales/fr_new.json"),
  ar: () => require("../locales/ar_new.json"),
};

export const getServerTranslations = async (lan) => {
  let temp = undefined;
  console.log("Fetching server translations for language:", lan);

  try {
    await getSavedTranslation(
      (value) => {
        console.log("Retrieved saved translations from storage:", value);
        if (value) {
          const translations = JSON.parse(value);
          const data = translations.find((item) => item.key === lan);
          if (data) {
            temp = data;
            console.log("Server translations found:", data);
          }
        }
      },
      (err) => console.error("Error fetching saved translation:", err)
    );
  } catch (error) {
    console.error("Error in getServerTranslations:", error);
  }

  console.log("Server translations result:", temp);
  return temp;
};

export const strings = memoize(
  (key, config) => {
    console.log("Accessing translation for key:", key, "with config:", config);
    return i18n.t(key, config);
  },
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const isRTLCheck = () => {
  try {
    console.log("Checking RTL status. Current locale:", i18n.locale);
    if (i18n.locale) {
      return i18n.locale.indexOf("ar") === 0;
    }
    console.warn("i18n.locale is undefined");
    return false;
  } catch (error) {
    console.error("Error in isRTLCheck:", error);
    return false;
  }
};

export const setI18nConfig = async (lan) => {
  strings.cache.clear();
  console.log("Initializing i18n with language:", lan);

  let languageTag =
    lan || I18n.locale || (i18n.currentLocale && i18n.currentLocale()) || "en";

  console.log("Resolved languageTag:", languageTag);

  try {
    i18n.translations = {
      [languageTag]: getLocalTranslations[languageTag]
        ? getLocalTranslations[languageTag]()
        : getLocalTranslations["en"](),
    };

    console.log("Initial local translations set for languageTag:", languageTag);
    console.log("i18n.translations after local set:", i18n.translations);

    const serverTranslations = await getServerTranslations(languageTag);
    if (serverTranslations) {
      i18n.translations[languageTag] = serverTranslations;
      console.log(
        "Server translations overridden for languageTag:",
        languageTag,
        "i18n.translations:",
        i18n.translations
      );
    }

    i18n.locale = languageTag;
    i18n.fallbacks = true;

    console.log("i18n configuration completed. Final locale:", i18n.locale);
    console.log("Final i18n.translations:", i18n.translations);
  } catch (error) {
    console.error("Error in setI18nConfig:", error);
  }
};
