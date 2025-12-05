import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number; userId: string }>();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Database'den fresh user bilgisini çek
    const freshUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!freshUser) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: freshUser.id,
      email: freshUser.email,
      role: freshUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: freshUser.id,
        email: freshUser.email,
        firstName: freshUser.firstName,
        lastName: freshUser.lastName,
        role: freshUser.role,
      },
    };
  }


  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async validateJwtPayload(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // Generate 6-digit verification code
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Request password change - returns verification code (should be sent via email)
  async requestPasswordChange(userId: string): Promise<{ code: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate verification code
    const code = this.generateVerificationCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store code with user email as key
    verificationCodes.set(user.email, {
      code,
      expiresAt,
      userId: user.id,
    });

    // Clean up expired codes
    this.cleanupExpiredCodes();

    return { code };
  }

  // Verify code and change password
  async changePasswordWithCode(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const stored = verificationCodes.get(email);

    if (!stored) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (stored.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);
      throw new BadRequestException('Verification code has expired');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: stored.userId },
    });

    if (!user || user.email !== email) {
      throw new UnauthorizedException('User not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Remove used code
    verificationCodes.delete(email);

    return { message: 'Password changed successfully' };
  }

  // Clean up expired codes
  private cleanupExpiredCodes() {
    const now = Date.now();
    for (const [email, data] of verificationCodes.entries()) {
      if (now > data.expiresAt) {
        verificationCodes.delete(email);
      }
    }
  }
}
