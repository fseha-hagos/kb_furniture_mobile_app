import am from '@/locales/am.json';
import en from '@/locales/en.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type LanguageCode = 'en' | 'am';

// const resources = {
//   en: { translation: { hello: "Hello", chooseLanguage: "Choose Language" } },
//   am: { translation: { hello: "ሰላም", chooseLanguage: "ቋንቋ ይምረጡ" } },
// };
const resources = {
    en: { translation: en },
    am: { translation: am },
  };


export const LANG_KEY = 'appLanguage';

export const setLanguage = async (lang: LanguageCode): Promise<void> => {
  await AsyncStorage.setItem(LANG_KEY, lang);
  i18n.changeLanguage(lang);
};

export const loadLanguage = async (): Promise<LanguageCode> => {
  const savedLang = await AsyncStorage.getItem(LANG_KEY);
  return (savedLang as LanguageCode) || 'en';
};

loadLanguage().then(lang => {
  i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
});

export default i18n;
