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
    findAllPosts(filters?: {
        category?: string;
        published?: boolean;
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
    getRecentPosts(limit?: number): Promise<({
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
    getAllTags(): Promise<string[]>;
}
