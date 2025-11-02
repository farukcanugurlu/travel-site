export declare class CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'ADMIN' | 'EDITOR' | 'USER';
}
