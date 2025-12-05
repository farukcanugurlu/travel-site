import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): any;
    requestPasswordChange(req: any): Promise<{
        code: string;
    }>;
    changePasswordWithCode(body: {
        email: string;
        code: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
