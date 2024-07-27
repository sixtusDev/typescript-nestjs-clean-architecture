export interface TaskHandler {
    taskName: string;
    handle<TTask>(task: TTask): Promise<void>;
    setup(): void;
}
