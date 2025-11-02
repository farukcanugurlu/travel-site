// src/blog/blog.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Blog Posts endpoints
  @Post('posts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (Admin only)' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createPost(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.createPost(createBlogPostDto);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all blog posts with filters' })
  @ApiResponse({ status: 200, description: 'Blog posts retrieved successfully' })
  findAllPosts(@Query() filters: { category?: string; published?: string }) {
    // Convert published string to boolean
    const parsedFilters: { category?: string; published?: boolean } = {};
    if (filters.category) parsedFilters.category = filters.category;
    if (filters.published !== undefined) {
      parsedFilters.published = filters.published === 'true' || filters.published === '1';
    }
    return this.blogService.findAllPosts(parsedFilters);
  }

  @Get('posts/recent')
  @ApiOperation({ summary: 'Get recent published blog posts' })
  @ApiResponse({ status: 200, description: 'Recent blog posts retrieved successfully' })
  getRecentPosts(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit) : 5;
    return this.blogService.getRecentPosts(limitNumber);
  }

  @Get('posts/slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findPostBySlug(@Param('slug') slug: string) {
    return this.blogService.findPostBySlug(slug);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findPostById(@Param('id') id: string) {
    return this.blogService.findPostById(id);
  }

  @Patch('posts/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  updatePost(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.updatePost(id, updateBlogPostDto);
  }

  @Delete('posts/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  removePost(@Param('id') id: string) {
    return this.blogService.removePost(id);
  }

  // Blog Categories endpoints
  @Post('categories')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Blog category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createCategory(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogService.createCategory(createBlogCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, description: 'Blog categories retrieved successfully' })
  findAllCategories() {
    return this.blogService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get blog category by ID' })
  @ApiResponse({ status: 200, description: 'Blog category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  findCategoryById(@Param('id') id: string) {
    return this.blogService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog category updated successfully' })
  updateCategory(@Param('id') id: string, @Body() updateData: Partial<CreateBlogCategoryDto>) {
    return this.blogService.updateCategory(id, updateData);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog category deleted successfully' })
  removeCategory(@Param('id') id: string) {
    return this.blogService.removeCategory(id);
  }

  // Tags endpoint (must be before posts/:id to avoid route conflict)
  @Get('tags')
  @ApiOperation({ summary: 'Get all unique tags from published blog posts' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  getAllTags() {
    return this.blogService.getAllTags();
  }

  // Blog Comments endpoints
  @Post('comments')
  @ApiOperation({ summary: 'Create a new blog comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createComment(@Body() createBlogCommentDto: CreateBlogCommentDto) {
    return this.blogService.createComment(createBlogCommentDto);
  }

  @Get('comments/post/:postId')
  @ApiOperation({ summary: 'Get all approved comments for a blog post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  getCommentsByPostId(@Param('postId') postId: string) {
    return this.blogService.getCommentsByPostId(postId);
  }
}
