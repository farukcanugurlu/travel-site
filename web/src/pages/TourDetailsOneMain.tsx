import { useParams } from "react-router-dom";
import FeatureDetailsOne from "../components/features/feature-details-one";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const TourDetailsOneMain = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <Wrapper>
      <SEO pageTitle={"Tour Details"} />
      <FeatureDetailsOne slug={slug} />
    </Wrapper>
  );
};

export default TourDetailsOneMain;
