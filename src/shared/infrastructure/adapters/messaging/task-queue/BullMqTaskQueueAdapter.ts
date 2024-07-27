import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { TaskQueuePort } from '@shared/core/ports/TaskQueuePort';
import { Job, Queue, Worker } from 'bullmq';

export class BullMQTaskQueueAdapter implements TaskQueuePort {
    private queues: Map<string, Queue> = new Map();
    private workers: Map<string, Worker> = new Map();

    constructor(
        private readonly redisConnection: { host: string; port: number },
        private readonly logger: LoggerPort,
    ) {}

    async addTask<TTask>(
        taskName: string,
        task: TTask,
        options?: {
            attempts?: number;
            backoff?: number | { type: string; delay: number };
            removeOnComplete?: boolean;
            removeOnFail?: boolean;
        },
    ): Promise<void> {
        const queue: Queue = this.getQueue(taskName);

        await queue.add(taskName, task, {
            attempts: options?.attempts ?? 5,
            backoff: options?.backoff ?? {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: options?.removeOnComplete ?? true,
            removeOnFail: options?.removeOnFail ?? true,
        });
    }

    processTask<TTask>(taskName: string, processor: (task: TTask) => Promise<void>): void {
        if (!this.workers.has(taskName)) {
            const worker: Worker = new Worker(
                taskName,
                async (task: Job) => {
                    this.logger.log(`Processing task: ${taskName}, Task ID: ${task.id}`, BullMQTaskQueueAdapter.name);

                    try {
                    } catch (error) {
                        this.logger.error(
                            `Task ${task.id} in queue ${taskName} failed with error:`,
                            BullMQTaskQueueAdapter.name,
                            error,
                        );
                        throw error;
                    }
                    await processor(task.data);
                },
                { connection: this.redisConnection },
            );

            worker.on('completed', (task: Job) => {
                this.logger.log(
                    `Task ${task.id} in queue ${taskName} completed and removed from the queue`,
                    BullMQTaskQueueAdapter.name,
                );
            });

            worker.on('failed', (task: Job, error: Error) => {
                if (task.attemptsMade < task.opts.attempts) {
                    this.logger.warn(
                        `Task ${task.id} in queue ${taskName} failed. Retrying... (${task.attemptsMade}/${task.opts.attempts})`,
                        BullMQTaskQueueAdapter.name,
                    );
                } else {
                    this.logger.error(
                        `Task ${task.id} in queue ${taskName} failed after ${task.opts.attempts} attempts:`,
                        BullMQTaskQueueAdapter.name,
                        error,
                    );
                }
            });

            this.workers.set(taskName, worker);
        }
    }

    private getQueue(name: string): Queue {
        if (!this.queues.has(name)) {
            this.queues.set(name, new Queue(name, { connection: this.redisConnection }));
        }
        return this.queues.get(name)!;
    }
}
