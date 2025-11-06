import { useState, useEffect } from "react";
import Ads from "./Ads";
import Category from "./Category";
import RecentPost from "./RecentPost";
import Tags from "./Tags";

interface BlogSidebarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onCategoryFilter?: (categoryId: string | null) => void;
  selectedCategoryId?: string | null;
}

const BlogSidebar = ({ 
  onSearch, 
  searchQuery: externalSearchQuery,
  onCategoryFilter,
  selectedCategoryId
}: BlogSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');

  // Sync with external search query if provided
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Real-time search as user types
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="tg-blog-sidebar top-sticky mb-30">
      <div className="tg-blog-sidebar-search tg-blog-sidebar-box mb-40">
        <h5 className="tg-blog-sidebar-title mb-15">Search</h5>
        <div className="tg-blog-sidebar-form">
          <form onSubmit={handleSubmit} className="p-relative">
            <input 
              type="text" 
              placeholder="Type here . . ." 
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button type="submit">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_497_1336)">
                  <path
                    d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z"
                    stroke="#560CE3"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_497_1336">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </form>
        </div>
      </div>
      <Category 
        onCategoryFilter={onCategoryFilter}
        selectedCategoryId={selectedCategoryId}
      />
      <RecentPost />
      <Ads />
      <Tags />
    </div>
  );
};

export default BlogSidebar;
