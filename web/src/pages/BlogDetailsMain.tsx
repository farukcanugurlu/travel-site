import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BlogDetails from "../components/blogs/blog-details";
import SEO from "../components/SEO";
import Wrapper from "../layouts/Wrapper";
import blogApiService, { type BlogPost } from "../api/blog";

const BlogDetailsMain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      blogApiService.getPostBySlug(slug)
        .then(setBlog)
        .catch(() => setBlog(null));
    }
  }, [slug]);

  // Generate SEO props from blog data
  const getSEOProps = () => {
    if (!blog) {
      return {
        pageTitle: "Blog Details",
        pageDescription: "Read our latest travel tips, guides and stories from Lexor Holiday",
        pageImage: "/assets/img/logo/lexorlogo.png",
        pageUrl: slug ? `/blog-details/${slug}` : undefined,
      };
    }

    const description = blog.excerpt || blog.content?.substring(0, 160) || `Read ${blog.title} on Lexor Holiday blog`;
    const image = blog.image || blog.thumbnail || "/assets/img/logo/lexorlogo.png";
    const blogImage = image.startsWith('http') ? image : `https://www.lexorholiday.com${image}`;
    
    // Generate structured data for blog post
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": description,
      "image": blogImage,
      "url": `https://www.lexorholiday.com/blog-details/${blog.slug}`,
      "datePublished": blog.createdAt || new Date().toISOString(),
      "dateModified": blog.updatedAt || blog.createdAt || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Lexor Holiday",
        "url": "https://www.lexorholiday.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lexor Holiday",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.lexorholiday.com/assets/img/logo/lexorlogo.png"
        }
      },
      ...(blog.tags && blog.tags.length > 0 && {
        "keywords": blog.tags.join(", ")
      })
    };

    return {
      pageTitle: blog.title,
      pageDescription: description,
      pageImage: blogImage,
      pageUrl: `/blog-details/${blog.slug}`,
      keywords: `${blog.title}, travel blog, ${blog.tags?.join(', ') || ''}, Turkey travel`,
      pageType: "article",
      structuredData,
    };
  };

  return (
    <Wrapper>
      <SEO {...getSEOProps()} />
      <BlogDetails slug={slug} />
    </Wrapper>
  );
};

export default BlogDetailsMain;
