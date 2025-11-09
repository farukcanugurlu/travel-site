import FooterSix from "../../../layouts/footers/FooterSix"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"
import BlogArea from "./BlogArea"

const BlogTwo = () => {
  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title="Blog" sub_title="Blog" pageType="blog" />
        <BlogArea />
      </main>
      <FooterSix />
    </>
  )
}

export default BlogTwo
