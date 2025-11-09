import FooterThree from "../../../../layouts/footers/FooterThree"
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
            <BreadCrumb title="Cart" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Cart
