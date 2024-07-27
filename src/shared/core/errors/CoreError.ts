import { Nullable } from '../types/UtilityTypes';
import { CodeDescription } from '../constants/CoreCodeDescriptions';

interface CoreErrorProps<TData> {
    codeDescription: CodeDescription;
    overrideMessage?: string;
    data?: TData;
}

export class CoreError<TData> extends Error {
    public readonly code: number;
    public readonly data: Nullable<TData>;

    constructor(props: CoreErrorProps<TData>) {
        super();

        this.name = this.constructor.name;
        this.message = props.overrideMessage ?? props.codeDescription.message;
        this.code = props.codeDescription.code;
        this.data = props.data ?? null;

        Error.captureStackTrace(this, this.constructor);
    }

    public static create<TData>(props: CoreErrorProps<TData>): CoreError<TData> {
        const coreError: CoreError<TData> = new CoreError({
            codeDescription: props.codeDescription,
            overrideMessage: props.overrideMessage,
            data: props.data,
        });

        return coreError;
    }
}
