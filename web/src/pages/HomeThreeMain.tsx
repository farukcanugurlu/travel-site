import HomeThree from "../components/homes/home-three";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const HomeThreeMain = () => {
  return (
    <Wrapper>
      <SEO pageTitle={""} />
      <HomeThree />
    </Wrapper>
  );
};

export default HomeThreeMain;
