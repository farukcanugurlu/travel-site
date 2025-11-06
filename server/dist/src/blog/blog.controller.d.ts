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
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
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
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    getRecentPosts(limit?: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    findPostBySlug(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        comments: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            email: string;
            approved: boolean;
            website: string | null;
            postId: string;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findPostById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    removePost(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string | null;
        published: boolean;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    createCategory(createBlogCategoryDto: CreateBlogCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    findAllCategories(): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }[]>;
    findCategoryById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    removeCategory(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        email: string;
        approved: boolean;
        website: string | null;
        postId: string;
    }>;
    getCommentsByPostId(postId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        email: string;
        approved: boolean;
        website: string | null;
        postId: string;
    }[]>;
}
