// src/api/blog.ts
import apiService from './api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category: BlogCategory;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: string;
  name: string;
  email: string;
  website?: string;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  postId: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogFilters {
  category?: string;
  published?: boolean;
  search?: string;
}

class BlogApiService {
  // Get all blog posts with filters
  async getPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/blog/posts?${queryString}` : '/blog/posts';
    
    return apiService.get<BlogPost[]>(endpoint);
  }

  // Get single blog post by ID
  async getPostById(id: string): Promise<BlogPost> {
    return apiService.get<BlogPost>(`/blog/posts/${id}`);
  }

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost> {
    return apiService.get<BlogPost>(`/blog/posts/slug/${slug}`);
  }

  // Get recent posts
  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return apiService.get<BlogPost[]>(`/blog/posts/recent?limit=${limit}`);
  }

  // Get all blog categories
  async getCategories(): Promise<BlogCategory[]> {
    return apiService.get<BlogCategory[]>('/blog/categories');
  }

  // Create blog post (Admin only)
  async createPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    return apiService.post<BlogPost>('/blog/posts', postData);
  }

  // Update blog post (Admin only)
  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    return apiService.patch<BlogPost>(`/blog/posts/${id}`, postData);
  }

  // Delete blog post (Admin only)
  async deletePost(id: string): Promise<void> {
    return apiService.delete<void>(`/blog/posts/${id}`);
  }

  // Create blog category (Admin only)
  async createCategory(categoryData: Partial<BlogCategory>): Promise<BlogCategory> {
    return apiService.post<BlogCategory>('/blog/categories', categoryData);
  }

  // Update blog category (Admin only)
  async updateCategory(id: string, categoryData: Partial<BlogCategory>): Promise<BlogCategory> {
    return apiService.patch<BlogCategory>(`/blog/categories/${id}`, categoryData);
  }

  // Delete blog category (Admin only)
  async deleteCategory(id: string): Promise<void> {
    return apiService.delete<void>(`/blog/categories/${id}`);
  }

  // Blog Comments
  async createComment(commentData: { name: string; email: string; website?: string; content: string; postId: string }): Promise<BlogComment> {
    return apiService.post<BlogComment>('/blog/comments', commentData);
  }

  async getCommentsByPostId(postId: string): Promise<BlogComment[]> {
    return apiService.get<BlogComment[]>(`/blog/comments/post/${postId}`);
  }

  // Tags
  async getAllTags(): Promise<string[]> {
    return apiService.get<string[]>('/blog/tags');
  }
}

export const blogApiService = new BlogApiService();
export default blogApiService;
