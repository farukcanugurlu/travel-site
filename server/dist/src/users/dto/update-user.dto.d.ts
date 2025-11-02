export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'EDITOR' | 'USER';
    isActive?: boolean;
}
