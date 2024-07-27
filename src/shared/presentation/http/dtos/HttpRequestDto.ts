import { ClassConstructor, plainToClass } from 'class-transformer';

export abstract class HttpRequestDto {
    public static create<T>(this: ClassConstructor<T>, props: Partial<T>): T {
        return plainToClass(this, props);
    }
}
