import { DefaultTheme } from '@react-navigation/native';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff', // Fond clair
    text: '#000',       // Texte sombre
  },
};

export default LightTheme;
