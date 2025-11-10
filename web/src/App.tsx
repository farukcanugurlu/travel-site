import { useEffect, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import AppNavigation from "./navigation/Navigation";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // <-- named import
import settingsApi, { type SiteSettingsData } from "./api/settings";
import { normalizeImageUrl } from "./utils/imageUtils";

function App() {
  const [favicon, setFavicon] = useState<string>("/assets/img/logo/lexorlogo.png");

  useEffect(() => {
    const loadFavicon = async () => {
      try {
        const settings: SiteSettingsData | null = await settingsApi.getSettings();
        if (settings?.favicon) {
          const faviconUrl = normalizeImageUrl(settings.favicon);
          setFavicon(faviconUrl);
        }
      } catch (error) {
        console.error('Error loading favicon:', error);
      }
    };
    loadFavicon();
  }, []);

  return (
    <>
      <Provider store={store}>
        <HelmetProvider>
          <Helmet>
            <link rel="icon" type="image/png" href={favicon} />
            <link rel="apple-touch-icon" href={favicon} />
          </Helmet>
          <AppNavigation />
        </HelmetProvider>
      </Provider>
    </>
  );
}

export default App;
