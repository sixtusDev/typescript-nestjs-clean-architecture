export interface LoggerPort {
    log(message: string, context: string, ...meta: any[]): void;
    debug(message: string, context: string, ...meta: any[]): void;
    warn(message: string, context: string, ...meta: any[]): void;
    error(message: string, context: string, ...meta: any[]): void;
}
