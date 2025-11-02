"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(createBlogPostDto) {
        return this.prisma.blogPost.create({
            data: createBlogPostDto,
            include: { category: true },
        });
    }
    async findAllPosts(filters) {
        const where = {};
        if (filters?.category) {
            where.category = { slug: filters.category };
        }
        if (filters?.published !== undefined) {
            where.published = filters.published;
        }
        return this.prisma.blogPost.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPostById(id) {
        return this.prisma.blogPost.findUnique({
            where: { id },
            include: { category: true },
        });
    }
    async findPostBySlug(slug) {
        return this.prisma.blogPost.findUnique({
            where: { slug },
            include: {
                category: true,
                comments: {
                    where: { approved: true },
                    orderBy: { createdAt: 'desc' }
                }
            },
        });
    }
    async updatePost(id, updateBlogPostDto) {
        return this.prisma.blogPost.update({
            where: { id },
            data: updateBlogPostDto,
            include: { category: true },
        });
    }
    async removePost(id) {
        return this.prisma.blogPost.delete({
            where: { id },
        });
    }
    async getRecentPosts(limit = 5) {
        return this.prisma.blogPost.findMany({
            where: { published: true },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async createCategory(createBlogCategoryDto) {
        return this.prisma.blogCategory.create({
            data: createBlogCategoryDto,
        });
    }
    async findAllCategories() {
        return this.prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findCategoryById(id) {
        return this.prisma.blogCategory.findUnique({
            where: { id },
        });
    }
    async updateCategory(id, updateData) {
        return this.prisma.blogCategory.update({
            where: { id },
            data: updateData,
        });
    }
    async removeCategory(id) {
        return this.prisma.blogCategory.delete({
            where: { id },
        });
    }
    async createComment(createCommentDto) {
        return this.prisma.blogComment.create({
            data: {
                name: createCommentDto.name,
                email: createCommentDto.email,
                website: createCommentDto.website,
                content: createCommentDto.content,
                postId: createCommentDto.postId,
                approved: false,
            },
            include: { post: { select: { id: true, title: true } } },
        });
    }
    async getCommentsByPostId(postId) {
        return this.prisma.blogComment.findMany({
            where: {
                postId,
                approved: true
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllTags() {
        const posts = await this.prisma.blogPost.findMany({
            where: { published: true },
            select: { tags: true },
        });
        const allTags = new Set();
        posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    if (tag)
                        allTags.add(tag);
                });
            }
        });
        return Array.from(allTags).sort();
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map