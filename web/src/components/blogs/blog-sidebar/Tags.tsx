import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogApiService from "../../../api/blog";

const Tags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await blogApiService.getAllTags();
      setTags(data || []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tg-blog-sidebar-tag tg-blog-sidebar-box">
        <h5 className="tg-blog-sidebar-title mb-25">Tags</h5>
        <div className="tg-blog-sidebar-tag-list">
          <p className="text-muted" style={{ fontSize: "14px" }}>Loading tags...</p>
        </div>
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="tg-blog-sidebar-tag tg-blog-sidebar-box">
      <h5 className="tg-blog-sidebar-title mb-25">Tags</h5>
      <div className="tg-blog-sidebar-tag-list">
        <ul>
          {tags.map((tag, i) => (
            <li key={i}>
              <Link to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tags;
