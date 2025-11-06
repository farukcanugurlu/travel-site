import FooterSix from "../../../../layouts/footers/FooterSix"
import HeaderThree from "../../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../../common/BreadCrumb"
import CartArea from "./CartArea"

const Cart = () => {
   return (
      <>
         <style>{`
            /* Cart sayfasında breadcrumb navigasyonunu gizle */
            .tg-breadcrumb-list-4 {
               display: none !important;
            }
         `}</style>
         <HeaderThree />
         <main>
            <BreadCrumb title="Cart Page" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterSix />
      </>
   )
}

export default Cart
