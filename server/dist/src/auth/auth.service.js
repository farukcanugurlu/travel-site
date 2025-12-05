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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const verificationCodes = new Map();
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
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
    async register(email, password, firstName, lastName) {
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
    async validateJwtPayload(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async requestPasswordChange(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const code = this.generateVerificationCode();
        const expiresAt = Date.now() + 15 * 60 * 1000;
        verificationCodes.set(user.email, {
            code,
            expiresAt,
            userId: user.id,
        });
        this.cleanupExpiredCodes();
        return { code };
    }
    async changePasswordWithCode(email, code, newPassword) {
        const stored = verificationCodes.get(email);
        if (!stored) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        if (stored.code !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (Date.now() > stored.expiresAt) {
            verificationCodes.delete(email);
            throw new common_1.BadRequestException('Verification code has expired');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: stored.userId },
        });
        if (!user || user.email !== email) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        verificationCodes.delete(email);
        return { message: 'Password changed successfully' };
    }
    cleanupExpiredCodes() {
        const now = Date.now();
        for (const [email, data] of verificationCodes.entries()) {
            if (now > data.expiresAt) {
                verificationCodes.delete(email);
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map