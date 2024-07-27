import { EventBusPort } from '@shared/core/ports/EventBusPort';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class NestJsEventBusAdapter implements EventBusPort {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    emit<TEvent>(eventName: string, payload: TEvent): void {
        this.eventEmitter.emit(eventName, payload);
    }

    subscribe<TEvent>(eventName: string, handler: (payload: TEvent) => void): void {
        this.eventEmitter.on(eventName, handler);
    }
}
