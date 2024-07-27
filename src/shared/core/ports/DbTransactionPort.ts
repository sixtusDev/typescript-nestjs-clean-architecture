export interface DbTransactionPort {
    run<T>(operation: (transactionRef: unknown) => Promise<T>): Promise<T>;
}
