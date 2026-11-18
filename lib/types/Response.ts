export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};