import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(createBlogPostDto: CreateBlogPostDto): Promise<{
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findAllPosts(filters?: {
        category?: string;
        published?: boolean;
    }): Promise<({
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    findPostById(id: string): Promise<{
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findPostBySlug(slug: string): Promise<{
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            content: string;
            approved: boolean;
            email: string;
            website: string | null;
            postId: string;
        }[];
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<{
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    removePost(id: string): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    getRecentPosts(limit?: number): Promise<({
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        tags: string[];
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    createCategory(createBlogCategoryDto: CreateBlogCategoryDto): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    findAllCategories(): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }[]>;
    findCategoryById(id: string): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    removeCategory(id: string): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    createComment(createCommentDto: {
        name: string;
        email: string;
        website?: string;
        content: string;
        postId: string;
    }): Promise<{
        post: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        approved: boolean;
        email: string;
        website: string | null;
        postId: string;
    }>;
    getCommentsByPostId(postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        approved: boolean;
        email: string;
        website: string | null;
        postId: string;
    }[]>;
    getAllTags(): Promise<string[]>;
}
