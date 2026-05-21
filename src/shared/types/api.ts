export interface ApiResponse<T> {
    success: boolean;
    data: T;
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