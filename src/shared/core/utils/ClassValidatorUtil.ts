import { validateSync, ValidationError } from 'class-validator';
import { Optional } from '../types/UtilityTypes';

export interface ClassValidationDetails {
    context: string;
    errors: ClassValidationErrors[];
}

export interface ClassValidationErrors {
    property: string;
    message: string[];
}

export class ClassValidatorUtil {
    public static validate<TTarget extends object>(
        target: TTarget,
        context?: string,
    ): Optional<ClassValidationDetails> {
        let details: Optional<ClassValidationDetails>;
        const errors: ValidationError[] = validateSync(target);

        if (errors.length > 0) {
            details = {
                context: context || target.constructor.name,
                errors: [],
            };
            for (const error of errors) {
                details.errors.push({
                    property: error.property,
                    message: error.constraints ? Object.values(error.constraints) : [],
                });
            }
        }

        return details;
    }
}
