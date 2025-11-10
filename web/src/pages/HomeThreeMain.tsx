import { useEffect, useState } from "react";
import HomeThree from "../components/homes/home-three";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";
import settingsApi, { type SiteSettingsData } from "../api/settings";
import { normalizeImageUrl } from "../utils/imageUtils";

const HomeThreeMain = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        setSettings(data || null);
      } catch (error) {
        console.error('Error loading settings:', error);
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
      <HomeThree />
    </Wrapper>
  );
};

export default HomeThreeMain;
