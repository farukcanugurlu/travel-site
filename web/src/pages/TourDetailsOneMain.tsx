import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FeatureDetailsOne from "../components/features/feature-details-one";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";
import toursApiService, { type Tour } from "../api/tours";

const TourDetailsOneMain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (slug) {
      toursApiService.getTourBySlug(slug)
        .then(setTour)
        .catch(() => setTour(null));
    }
  }, [slug]);

  // Generate SEO props from tour data
  const getSEOProps = () => {
    if (!tour) {
      return {
        pageTitle: "Tour Details",
        pageDescription: "Discover amazing tours and experiences with Lexor Holiday",
        pageImage: "/assets/img/logo/lexorlogo.png",
        pageUrl: slug ? `/tour/${slug}` : undefined,
      };
    }

    const description = tour.excerpt || tour.description?.substring(0, 160) || `Join us for ${tour.title} - an unforgettable experience with Lexor Holiday`;
    const image = tour.thumbnail || tour.images?.[0] || "/assets/img/logo/lexorlogo.png";
    const tourImage = image.startsWith('http') ? image : `https://lexorholiday.com${image}`;
    
    // Generate structured data for tour
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.title,
      "description": tour.description || tour.excerpt || "",
      "image": tourImage,
      "url": `https://lexorholiday.com/tour/${tour.slug}`,
      "provider": {
        "@type": "TravelAgency",
        "name": "Lexor Holiday",
        "url": "https://lexorholiday.com"
      },
      "destination": tour.destination?.name || "",
      "duration": tour.duration || "",
      ...(tour.packages && tour.packages.length > 0 && {
        "offers": tour.packages.map((pkg: any) => ({
          "@type": "Offer",
          "name": pkg.name,
          "price": pkg.price,
          "priceCurrency": pkg.currency || "TRY",
          "availability": "https://schema.org/InStock"
        }))
      })
    };

    return {
      pageTitle: tour.title,
      pageDescription: description,
      pageImage: tourImage,
      pageUrl: `/tour/${tour.slug}`,
      keywords: `${tour.title}, ${tour.destination?.name || ''}, Turkey tours, travel, holiday`,
      pageType: "website",
      structuredData,
    };
  };

  return (
    <Wrapper>
      <SEO {...getSEOProps()} />
      <FeatureDetailsOne slug={slug} />
    </Wrapper>
  );
};

export default TourDetailsOneMain;
