// pages/_app.js
// Wrap entire site in LanguageProvider for EN | ES toggle

import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
