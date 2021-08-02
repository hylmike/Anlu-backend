export declare class RegisterLibDto {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
export declare class UpdateLibProfileDto {
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isActive: string;
}
export interface ChangeLibPwdDto {
    username: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface OperationLogDto {
    operator: string;
    time: string;
    operation: string;
    details: string;
}
