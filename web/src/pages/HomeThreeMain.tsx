import { useEffect, useState } from "react";
import HomeThree from "../components/homes/home-three";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";
import settingsApi, { type SiteSettingsData } from "../api/settings";
import { normalizeImageUrl } from "../utils/imageUtils";

const HomeThreeMain = () => {
  // İlk render için cache'den senkron oku (hızlı başlangıç)
  const [settings, setSettings] = useState<SiteSettingsData | null>(() => {
    return settingsApi.getCachedSettingsSync();
  });
  const [isReady, setIsReady] = useState(false);

  // Sayfa yüklendiğinde scroll'u en üste zorla
  useEffect(() => {
    // Scroll'u hemen en üste al
    window.scrollTo(0, 0);
    // Scroll restoration'ı devre dışı bırak
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        setSettings(data || null);
        
        // Settings yüklendikten sonra image'leri preload et
        if (data?.heroSliderImages) {
          const validImages = data.heroSliderImages
            .filter(img => img && img.trim() !== '' && img !== 'undefined' && img !== 'null')
            .map(img => normalizeImageUrl(img))
            .filter((img): img is string => img !== null && !img.includes('/assets/img/hero/'));
          
          // Image'leri preload et
          const preloadPromises = validImages.map((imgUrl) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Hata olsa bile devam et
              img.src = imgUrl;
            });
          });
          
          // Tüm image'ler yüklenene kadar bekle (max 1 saniye)
          await Promise.race([
            Promise.all(preloadPromises),
            new Promise(resolve => setTimeout(resolve, 1000))
          ]);
        }
        
        // About image'lerini de preload et
        if (data) {
          const aboutImages = [
            data.aboutLogo,
            data.aboutLeftImage1,
            data.aboutLeftImage2,
            data.aboutRightImage1,
            data.aboutRightImage2
          ]
            .filter((img): img is string => img !== null && img !== undefined)
            .map(img => normalizeImageUrl(img))
            .filter((img): img is string => img !== null);
          
          const preloadPromises = aboutImages.map((imgUrl) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = imgUrl;
            });
          });
          
          await Promise.race([
            Promise.all(preloadPromises),
            new Promise(resolve => setTimeout(resolve, 1000))
          ]);
        }
        
        // Her şey hazır, sayfayı göster
        setIsReady(true);
        // Scroll'u tekrar en üste al (güvenlik için)
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Hata durumunda cache'den oku
        const cached = settingsApi.getCachedSettingsSync();
        if (cached) {
          setSettings(cached);
        }
        setIsReady(true);
        window.scrollTo(0, 0);
      }
    };
    loadSettings();
  }, []);

  // Organization structured data for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": settings?.siteTitle || "Lexor Holiday",
    "url": settings?.siteUrl || "https://lexorholiday.com",
    "logo": settings?.logo ? normalizeImageUrl(settings.logo) : "https://lexorholiday.com/assets/img/logo/lexorlogo.png",
    "description": settings?.siteDescription || settings?.companyDescription || "Premium travel agency offering curated tours and unforgettable experiences in Turkey and around the world.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.officeAddress || "",
      "addressCountry": "TR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": settings?.email || "info@lexorholiday.com",
      "telephone": settings?.phone || ""
    },
    "sameAs": [
      settings?.facebook || "",
      settings?.instagram || "",
      settings?.twitter || "",
      settings?.youtube || ""
    ].filter(Boolean)
  };

  const siteTitle = settings?.siteTitle || "Lexor Holiday - Premium Travel Agency | Tours & Experiences";
  const siteDescription = settings?.siteDescription || settings?.companyDescription || "Lexor Holiday - Premium travel agency offering curated tours and unforgettable experiences in Turkey and around the world. Discover amazing destinations with expert guides.";
  const siteKeywords = settings?.siteKeywords || "lexor holiday, travel agency, turkey tours, antalya tours, cappadocia tours, travel booking, holiday packages, luxury travel";
  const ogImage = settings?.ogImage ? normalizeImageUrl(settings.ogImage) : "/assets/img/logo/lexorlogo.png";
  const siteUrl = settings?.siteUrl || "https://lexorholiday.com";

  // Settings yüklenene kadar skeleton göster
  if (!isReady) {
    return (
      <Wrapper>
        <SEO 
          pageTitle=""
          pageDescription={siteDescription}
          pageImage={ogImage}
          pageUrl={siteUrl}
          keywords={siteKeywords}
          structuredData={organizationSchema}
        />
        <div style={{ 
          minHeight: '100vh',
          backgroundColor: '#fff'
        }}>
          {/* Hero skeleton */}
          <div style={{
            height: '100vh',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SEO 
        pageTitle=""
        pageDescription={siteDescription}
        pageImage={ogImage}
        pageUrl={siteUrl}
        keywords={siteKeywords}
        structuredData={organizationSchema}
      />
      <HomeThree settings={settings} />
    </Wrapper>
  );
};

export default HomeThreeMain;
