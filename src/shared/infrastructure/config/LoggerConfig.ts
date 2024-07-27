import * as winston from 'winston';
import { inspect } from 'util';
import { format } from 'date-fns';
import 'colors';

export class LoggerConfig {
    public static createWinstonLoggerConfig(): winston.LoggerOptions {
        return {
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp, context, ...meta }): string => {
                    let colorizedLevel: string;
                    let colorizedMessage: string;
                    let colorizedAppName: string = '[Typescript Clean Architecture]';
                    const colorizedContext: string = `[${context}] `.magenta;

                    switch (level) {
                        case 'error':
                            colorizedLevel = `[${level}]`.toUpperCase().red;
                            colorizedMessage = `${message}`.red;
                            colorizedAppName = `[Typescript Clean Architecture]`.red;
                            break;
                        case 'warn':
                            colorizedLevel = `[${level}]`.toUpperCase().yellow;
                            colorizedMessage = `${message}`.yellow;
                            colorizedAppName = `[Typescript Clean Architecture]`.yellow;
                            break;
                        case 'info':
                            colorizedLevel = `[${level}]`.toUpperCase().green;
                            colorizedMessage = `${message}`.green;
                            colorizedAppName = `[Typescript Clean Architecture]`.green;
                            break;
                        case 'debug':
                            colorizedLevel = `[${level}]`.toUpperCase().blue;
                            colorizedMessage = `${message}`.blue;
                            colorizedAppName = `[Typescript Clean Architecture]`.blue;
                            break;
                        default:
                            colorizedLevel = `[${level}]`.toLocaleUpperCase();
                    }

                    let metaStr = '';
                    if (Object.keys(meta).length) {
                        metaStr = '\n' + inspect(meta, { colors: true, depth: null });
                    }

                    const formattedTimestamp: string = format(new Date(timestamp), 'MM/dd/yyyy, h:mm:ss a');

                    return `${colorizedAppName} ${process.pid} -- ${formattedTimestamp} ${colorizedLevel} ${colorizedContext}${colorizedMessage}${metaStr}`;
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `logs/error-${format(new Date(), 'yyyy-MM-dd')}.log`,
                    level: 'error',
                }),
                new winston.transports.File({ filename: `logs/combined-${format(new Date(), 'yyyy-MM-dd')}.log` }),
            ],
        };
    }
}
