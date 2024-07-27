export interface EventBusPort {
    emit<TEvent>(eventName: string, event: TEvent): void;
    subscribe<TEvent>(eventName: string, handler: (event: TEvent) => void): void;
}
