import { IsUUID } from 'class-validator';
import { ValueObject } from './ValueObject';
import { randomUUID } from 'crypto';

export class UniqueId extends ValueObject {
    @IsUUID()
    private readonly value: string;

    private constructor(id: string) {
        super();

        this.value = id;
    }

    public get getValue(): string {
        return this.value;
    }

    public static create(id?: string): UniqueId {
        const uniqueId: UniqueId = new UniqueId(id ?? randomUUID());

        uniqueId.validate();

        return uniqueId;
    }
}
