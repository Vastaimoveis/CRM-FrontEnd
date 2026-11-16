
export class ApiError extends Error {
    public readonly errorCode: string | null;

    constructor(
        message: string,
        errorCode: string | null = null
    ) {
        super(message);

        this.name = "ApiError";
        this.errorCode = errorCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
