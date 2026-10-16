export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    errorCode?: string;
    text: string;
}

export interface PageResponse<T> {
    content: T[];

    number: number;
    size: number;

    totalElements: number;
    totalPages: number;

    first: boolean;
    last: boolean;

    numberOfElements: number;
    empty: boolean;
}

export interface ApiErrorResponse {
    success: false;
    data: unknown;
    message: string;
}