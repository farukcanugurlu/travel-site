import FooterThree from "../../layouts/footers/FooterThree";
import HeaderThree from "../../layouts/headers/HeaderThree";
import BreadCrumb from "../common/BreadCrumb";
import ContactArea from "./ContactArea";

const Contact = () => {
  return (
    <>
      <HeaderThree />
      <main>
        {/* (TR) Breadcrumb linklerini gizle + sayfayı aşağı it + footer üst padding biraz azalt */}
        <style>{`
          .tg-breadcrumb-area .tg-breadcrumb-content ul,
          .tg-breadcrumb-area .breadcrumb,
          .tg-breadcrumb-area .tg-breadcrumb-list {
            display: none !important;
          }

          /* (TR) Footer'a dokunmadan sayfayı aşağı uzat */
          .contact-page-pushdown { height: 160px; }
          @media (min-width: 992px) {
            .contact-page-pushdown { height: 180px; }
          }

          /* (TR) SADECE bu sayfada footer üst boşluğunu biraz kıs */
          footer .tg-footer-area.tg-footer-space {
            padding-top: 90px !important;
          }
          @media (min-width: 992px) {
            footer .tg-footer-area.tg-footer-space {
              padding-top: 110px !important;
            }
          }
        `}</style>

        <BreadCrumb title="Contact With Us" sub_title="Contact" />
        <ContactArea />

        {/* (TR) Footer'ı aşağı iten görünmez boşluk */}
        <div className="contact-page-pushdown" />
      </main>
      <FooterThree />
    </>
  );
};

export default Contact;
