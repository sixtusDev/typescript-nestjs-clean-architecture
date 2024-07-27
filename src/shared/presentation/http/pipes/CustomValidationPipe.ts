import { ValidationPipe, ValidationError } from '@nestjs/common';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { CoreError } from '@shared/core/errors/CoreError';
import { Optional } from '@shared/core/types/UtilityTypes';
import { ClassValidationDetails } from '@shared/core/utils/ClassValidatorUtil';

export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors: ValidationError[]) => {
                let details: Optional<ClassValidationDetails>;

                if (errors.length > 0) {
                    details = {
                        context: errors[0]?.target.constructor.name,
                        errors: [],
                    };
                    for (const error of errors) {
                        details.errors.push({
                            property: error.property,
                            message: error.constraints ? Object.values(error.constraints) : [],
                        });
                    }
                }

                return CoreError.create({
                    codeDescription: CoreCodeDescriptions.BAD_REQUEST_ERROR,
                    data: details,
                });
            },
        });
    }
}
