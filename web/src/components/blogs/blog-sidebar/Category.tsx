import React, { useEffect, useMemo, useState } from 'react';
import blogApiService, { type BlogCategory, type BlogPost } from '../../../api/blog';

const Category: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cats, allPosts] = await Promise.all([
          blogApiService.getCategories(),
          blogApiService.getPosts({ published: true })
        ]);
        setCategories(cats);
        setPosts(allPosts);
      } catch (err) {
        console.error('Failed to load blog categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of posts) {
      const catId = post.category?.id;
      if (!catId) continue;
      map.set(catId, (map.get(catId) || 0) + 1);
    }
    return map;
  }, [posts]);

  return (
    <div className="tg-blog-categories tg-blog-sidebar-box mb-40">
      <h5 className="tg-blog-sidebar-title mb-5">Categories</h5>
      <div className="tg-blog-categories-list">
        {loading ? (
          <div style={{ padding: '8px 0', color: '#888' }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: '8px 0', color: '#e74c3c' }}>{error}</div>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <span>{cat.name}</span>
                <span>({countsByCategory.get(cat.id) || 0})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Category;
