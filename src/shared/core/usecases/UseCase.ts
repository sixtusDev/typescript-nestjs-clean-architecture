export interface UseCase<TRequest, TResponse> {
    execute(request?: TRequest, transactionRef?: unknown): Promise<TResponse> | TResponse;
}
