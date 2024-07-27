import { CoreCodeDescriptions } from '../constants/CoreCodeDescriptions';
import { CoreError } from '../errors/CoreError';
import { Optional } from '../types/UtilityTypes';
import { ClassValidationDetails, ClassValidatorUtil } from '../utils/ClassValidatorUtil';

export abstract class ValueObject {
    public validate(): void {
        const errors: Optional<ClassValidationDetails> = ClassValidatorUtil.validate(this);
        if (errors) {
            throw CoreError.create({
                codeDescription: CoreCodeDescriptions.VALUE_OBJECT_VALIDATION_ERROR,
                data: errors,
            });
        }
    }
}
