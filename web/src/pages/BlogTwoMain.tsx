import BlogTwo from "../components/blogs/blog-two";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";

const BlogTwoMain = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Blog Two"} />
      <BlogTwo />
    </Wrapper>
  );
};

export default BlogTwoMain;
