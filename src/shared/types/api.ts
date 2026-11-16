export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
    errorCode?: string | null;
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