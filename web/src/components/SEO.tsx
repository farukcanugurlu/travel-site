/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../ui/ErrorBoundary";

interface SEOProps {
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  pageUrl?: string;
  pageType?: string;
  keywords?: string;
  noindex?: boolean;
  structuredData?: object;
}

const defaultSiteUrl = 'https://www.lexorholiday.com';
const defaultImage = '/assets/img/logo/lexorlogo.png';
const defaultDescription = 'Lexor Holiday - Premium travel agency offering curated tours and unforgettable experiences in Turkey and around the world. Discover amazing destinations with expert guides.';
const defaultKeywords = 'lexor holiday, travel agency, turkey tours, antalya tours, cappadocia tours, travel booking, holiday packages, luxury travel';

const SEO = ({ 
  pageTitle = '',
  pageDescription,
  pageImage,
  pageUrl,
  pageType = 'website',
  keywords,
  noindex = false,
  structuredData
}: SEOProps) => {
  const fullTitle = pageTitle 
    ? `${pageTitle} | Lexor Holiday - Travel Agency`
    : 'Lexor Holiday - Premium Travel Agency | Tours & Experiences';
  
  const description = pageDescription || defaultDescription;
  const image = pageImage ? (pageImage.startsWith('http') ? pageImage : `${defaultSiteUrl}${pageImage}`) : `${defaultSiteUrl}${defaultImage}`;
  const url = pageUrl ? (pageUrl.startsWith('http') ? pageUrl : `${defaultSiteUrl}${pageUrl}`) : defaultSiteUrl;
  const allKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <ErrorBoundary>
      <Helmet>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <title>{fullTitle}</title>
        <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
        <meta name="description" content={description} />
        <meta name="keywords" content={allKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="author" content="Lexor Holiday" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={url} />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/assets/img/logo/lexorlogo.png" />
        <link rel="apple-touch-icon" href="/assets/img/logo/lexorlogo.png" />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content={pageType} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Lexor Holiday" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@lexorholiday" />
        
        {/* Structured Data (JSON-LD) */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
    </ErrorBoundary>
  );
};

export default SEO;
