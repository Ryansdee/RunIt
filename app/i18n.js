import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFR from './(tabs)/locales/fr/translation.json'; // Assurez-vous que ce fichier existe

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: translationFR,
      },
    },
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr', // Langue de secours
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
