import Checkout from "../components/pages/shops/checkout";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const CheckoutMain = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Checkout"} />
      <Checkout />
    </Wrapper>
  );
};

export default CheckoutMain;
