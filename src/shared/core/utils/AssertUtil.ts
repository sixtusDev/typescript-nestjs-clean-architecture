import { Nullable } from '../types/UtilityTypes';

export class AssertUtil {
    public static isTrue(expression: boolean, error: Error) {
        if (!expression) throw error;
    }

    public static isFalse(expression: boolean, error: Error) {
        if (expression) throw error;
    }

    public static notEmpty<T>(value: Nullable<T>, error: Error): T {
        if (value === null || value === undefined) {
            throw error;
        }
        return value;
    }
}
