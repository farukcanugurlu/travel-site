import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    createPost(createBlogPostDto: CreateBlogPostDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findAllPosts(filters: {
        category?: string;
        published?: string;
    }): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    getRecentPosts(limit?: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    findPostBySlug(slug: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
        comments: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            content: string;
            approved: boolean;
            website: string | null;
            postId: string;
        }[];
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findPostById(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    removePost(id: string): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        content: string;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    createCategory(createBlogCategoryDto: CreateBlogCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
    }>;
    findAllCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
    }[]>;
    findCategoryById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
    }>;
    updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
    }>;
    removeCategory(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
    }>;
    getAllTags(): Promise<string[]>;
    createComment(createBlogCommentDto: CreateBlogCommentDto): Promise<{
        post: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        approved: boolean;
        website: string | null;
        postId: string;
    }>;
    getCommentsByPostId(postId: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        approved: boolean;
        website: string | null;
        postId: string;
    }[]>;
}
