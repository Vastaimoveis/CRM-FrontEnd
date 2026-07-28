export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    errorCode?: string;
    text: string;
}

export interface PageResponse<T> {
    content: T[];

    totalElements: number;
    totalPages: number;

    size: number;
    number: number;

    first: boolean;
    last: boolean;
}

export interface ApiErrorResponse {
    success: false;
    data: unknown;
    message: string;
}