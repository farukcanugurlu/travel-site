import HomeThree from "../components/homes/home-three";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const HomeThreeMain = () => {
  // Organization structured data for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Lexor Holiday",
    "url": "https://www.lexorholiday.com",
    "logo": "https://www.lexorholiday.com/assets/img/logo/lexorlogo.png",
    "description": "Premium travel agency offering curated tours and unforgettable experiences in Turkey and around the world.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@lexorholiday.com"
    },
    "sameAs": [
      "https://www.facebook.com/lexorholiday",
      "https://www.instagram.com/lexorholiday"
    ]
  };

  return (
    <Wrapper>
      <SEO 
        pageTitle=""
        pageDescription="Lexor Holiday - Premium travel agency offering curated tours and unforgettable experiences in Turkey and around the world. Discover amazing destinations with expert guides."
        pageImage="/assets/img/logo/lexorlogo.png"
        keywords="lexor holiday, travel agency, turkey tours, antalya tours, cappadocia tours, travel booking, holiday packages, luxury travel"
        structuredData={organizationSchema}
      />
      <HomeThree />
    </Wrapper>
  );
};

export default HomeThreeMain;
