export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    result: string;
    data: unknown;
    desc?: string;

    message?: string;
    error?: string;
    code?: number;
}