export interface TaskQueuePort {
    addTask<TTask>(
        taskName: string,
        task: TTask,
        options?: {
            attempts?: number;
            backoff?: number | { type: string; delay: number };
            removeOnComplete?: boolean;
            removeOnFail?: boolean;
        },
    ): Promise<void>;
    processTask<TTask>(taskName: string, processor: (task: TTask) => Promise<void>): void;
}
