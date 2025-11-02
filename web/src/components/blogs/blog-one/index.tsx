import FooterThree from "../../../layouts/footers/FooterThree";
import HeaderThree from "../../../layouts/headers/HeaderThree";
import BreadCrumb from "../../common/BreadCrumb";
import BlogArea from "./BlogArea";

const BlogOne = () => {
  return (
    <>
      <HeaderThree />
      <main>
        {/* (TR) Yalnızca bu sayfada breadcrumb linklerini gizle + sayfayı uzat + footer üst padding biraz kıs */}
        <style>{`
          .tg-breadcrumb-area .tg-breadcrumb-content ul,
          .tg-breadcrumb-area .breadcrumb,
          .tg-breadcrumb-area .tg-breadcrumb-list {
            display: none !important;
          }

          /* (TR) Footer'a dokunmadan sayfayı biraz aşağı uzat */
          .blog-page-pushdown { height: 160px; }
          @media (min-width: 992px) {
            .blog-page-pushdown { height: 180px; }
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

        <BreadCrumb title="Blogs" sub_title="Blog" />
        <BlogArea />

        {/* (TR) Footer'ı aşağı iten görünmez boşluk */}
        <div className="blog-page-pushdown" />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogOne;
