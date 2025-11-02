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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const blog_service_1 = require("./blog.service");
const create_blog_post_dto_1 = require("./dto/create-blog-post.dto");
const update_blog_post_dto_1 = require("./dto/update-blog-post.dto");
const create_blog_category_dto_1 = require("./dto/create-blog-category.dto");
const create_blog_comment_dto_1 = require("./dto/create-blog-comment.dto");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    createPost(createBlogPostDto) {
        return this.blogService.createPost(createBlogPostDto);
    }
    findAllPosts(filters) {
        const parsedFilters = {};
        if (filters.category)
            parsedFilters.category = filters.category;
        if (filters.published !== undefined) {
            parsedFilters.published = filters.published === 'true' || filters.published === '1';
        }
        return this.blogService.findAllPosts(parsedFilters);
    }
    getRecentPosts(limit) {
        const limitNumber = limit ? parseInt(limit) : 5;
        return this.blogService.getRecentPosts(limitNumber);
    }
    findPostBySlug(slug) {
        return this.blogService.findPostBySlug(slug);
    }
    findPostById(id) {
        return this.blogService.findPostById(id);
    }
    updatePost(id, updateBlogPostDto) {
        return this.blogService.updatePost(id, updateBlogPostDto);
    }
    removePost(id) {
        return this.blogService.removePost(id);
    }
    createCategory(createBlogCategoryDto) {
        return this.blogService.createCategory(createBlogCategoryDto);
    }
    findAllCategories() {
        return this.blogService.findAllCategories();
    }
    findCategoryById(id) {
        return this.blogService.findCategoryById(id);
    }
    updateCategory(id, updateData) {
        return this.blogService.updateCategory(id, updateData);
    }
    removeCategory(id) {
        return this.blogService.removeCategory(id);
    }
    getAllTags() {
        return this.blogService.getAllTags();
    }
    createComment(createBlogCommentDto) {
        return this.blogService.createComment(createBlogCommentDto);
    }
    getCommentsByPostId(postId) {
        return this.blogService.getCommentsByPostId(postId);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog post (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Blog post created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_post_dto_1.CreateBlogPostDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog posts with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog posts retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findAllPosts", null);
__decorate([
    (0, common_1.Get)('posts/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent published blog posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent blog posts retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getRecentPosts", null);
__decorate([
    (0, common_1.Get)('posts/slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog post by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findPostBySlug", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findPostById", null);
__decorate([
    (0, common_1.Patch)('posts/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update blog post (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_post_dto_1.UpdateBlogPostDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete blog post (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "removePost", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Blog category created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_category_dto_1.CreateBlogCategoryDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog categories retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog category retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findCategoryById", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update blog category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog category updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete blog category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog category deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all unique tags from published blog posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Post)('comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog comment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_comment_dto_1.CreateBlogCommentDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)('comments/post/:postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all approved comments for a blog post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comments retrieved successfully' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getCommentsByPostId", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blog'),
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map