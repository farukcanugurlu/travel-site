export declare class CreateBlogPostDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    author?: string;
    tags?: string[];
    published?: boolean;
    categoryId: string;
}
