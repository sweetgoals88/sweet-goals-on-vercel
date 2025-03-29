export class ApiResponseError extends Error {
    status: number;

    constructor(message: string, status: number, options?: ErrorOptions) {
        super(message, options);
        this.status = status;
    }

    static aggregateWith(message: string, error: any, defaultStatus: number) {
        if (error instanceof ApiResponseError) {
            return new ApiResponseError(`${message}.\n${error.message}`, error.status);
        }
        return new ApiResponseError(`${message}.\n${error}`, defaultStatus);
    }
};
