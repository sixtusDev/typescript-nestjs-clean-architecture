import { Optional } from '../types/UtilityTypes';
import { TaskHandler } from './TaskHandler';

export class TaskHandlerRegistry {
    private handlers: Map<string, TaskHandler> = new Map();

    registerHandler(handler: TaskHandler): void {
        this.handlers.set(handler.taskName, handler);
    }

    setupAll(): void {
        this.handlers.forEach((handler) => handler.setup());
    }

    getHandler(taskName: string): Optional<TaskHandler> {
        return this.handlers.get(taskName);
    }
}
