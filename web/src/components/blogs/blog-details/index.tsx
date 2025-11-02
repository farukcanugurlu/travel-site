import { useParams } from "react-router-dom";
import BlogDetailsArea from "./BlogDetailsArea"
import FooterFive from "../../../layouts/footers/FooterFive"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title="Blog Details" sub_title="" />
        <BlogDetailsArea slug={slug} />
      </main>
      <FooterFive />
    </>
  )
}

export default BlogDetails
