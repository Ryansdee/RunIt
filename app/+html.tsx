import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import './styles/global.css';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/0913375870.js"></script>

        {/* Désactiver le défilement du corps sur le web */}
        <ScrollViewStyleReset />

        {/* Styles pour forcer le mode clair */}
        <style>
          {`
            body {
              background-color: #fff !important; /* Forcer le fond blanc */
              color: #000 !important; /* Forcer le texte noir */
              --tw-bg-opacity: 1;
              --tw-text-opacity: 1;
            }
            
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #fff !important;
                color: #000 !important;
              }
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
