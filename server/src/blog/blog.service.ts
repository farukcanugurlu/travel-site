import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Blog Posts CRUD
  async createPost(createBlogPostDto: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: createBlogPostDto,
      include: { category: true },
    });
  }

  async findAllPosts(filters?: { category?: string; published?: boolean }) {
    const where: any = {};

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

  async findPostById(id: string) {
    return this.prisma.blogPost.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findPostBySlug(slug: string) {
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

  async updatePost(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    return this.prisma.blogPost.update({
      where: { id },
      data: updateBlogPostDto,
      include: { category: true },
    });
  }

  async removePost(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async getRecentPosts(limit: number = 5) {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Blog Categories CRUD
  async createCategory(createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.prisma.blogCategory.create({
      data: createBlogCategoryDto,
    });
  }

  async findAllCategories() {
    return this.prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: string) {
    return this.prisma.blogCategory.findUnique({
      where: { id },
    });
  }

  async updateCategory(id: string, updateData: Partial<CreateBlogCategoryDto>) {
    return this.prisma.blogCategory.update({
      where: { id },
      data: updateData,
    });
  }

  async removeCategory(id: string) {
    return this.prisma.blogCategory.delete({
      where: { id },
    });
  }

  // Blog Comments CRUD
  async createComment(createCommentDto: { name: string; email: string; website?: string; content: string; postId: string }) {
    return this.prisma.blogComment.create({
      data: {
        name: createCommentDto.name,
        email: createCommentDto.email,
        website: createCommentDto.website,
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        approved: false, // Comments need approval
      },
      include: { post: { select: { id: true, title: true } } },
    });
  }

  async getCommentsByPostId(postId: string) {
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
    
    const allTags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag) allTags.add(tag);
        });
      }
    });
    
    return Array.from(allTags).sort();
  }
}
