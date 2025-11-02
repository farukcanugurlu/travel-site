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
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    }>;
    findAllPosts(filters: {
        category?: string;
        published?: string;
    }): Promise<({
        category: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    })[]>;
    getRecentPosts(limit?: string): Promise<({
        category: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    })[]>;
    findPostBySlug(slug: string): Promise<{
        category: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
        comments: {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            website: string | null;
            approved: boolean;
            postId: string;
        }[];
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    }>;
    findPostById(id: string): Promise<{
        category: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    }>;
    updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<{
        category: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    }>;
    removePost(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        author: string | null;
        tags: string[];
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
    }>;
    createCategory(createBlogCategoryDto: CreateBlogCategoryDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    findAllCategories(): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }[]>;
    findCategoryById(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    removeCategory(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        content: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        website: string | null;
        approved: boolean;
        postId: string;
    }>;
    getCommentsByPostId(postId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        website: string | null;
        approved: boolean;
        postId: string;
    }[]>;
}
