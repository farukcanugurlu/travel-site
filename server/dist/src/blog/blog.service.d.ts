import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(createBlogPostDto: CreateBlogPostDto): Promise<{
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findAllPosts(filters?: {
        category?: string;
        published?: boolean;
    }): Promise<({
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    findPostById(id: string): Promise<{
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    findPostBySlug(slug: string): Promise<{
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        comments: {
            name: string;
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            approved: boolean;
            email: string;
            website: string | null;
            postId: string;
        }[];
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<{
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    removePost(id: string): Promise<{
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    }>;
    getRecentPosts(limit?: number): Promise<({
        category: {
            name: string;
            description: string | null;
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        slug: string;
        excerpt: string | null;
        published: boolean;
        tags: string[];
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featuredImage: string | null;
        author: string | null;
        categoryId: string;
    })[]>;
    createCategory(createBlogCategoryDto: CreateBlogCategoryDto): Promise<{
        name: string;
        description: string | null;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllCategories(): Promise<{
        name: string;
        description: string | null;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findCategoryById(id: string): Promise<{
        name: string;
        description: string | null;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>): Promise<{
        name: string;
        description: string | null;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeCategory(id: string): Promise<{
        name: string;
        description: string | null;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createComment(createCommentDto: {
        name: string;
        email: string;
        website?: string;
        content: string;
        postId: string;
    }): Promise<{
        post: {
            title: string;
            id: string;
        };
    } & {
        name: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        email: string;
        website: string | null;
        postId: string;
    }>;
    getCommentsByPostId(postId: string): Promise<{
        name: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        email: string;
        website: string | null;
        postId: string;
    }[]>;
    getAllTags(): Promise<string[]>;
}
