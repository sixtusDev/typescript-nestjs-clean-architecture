import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { Nullable } from '@shared/core/types/UtilityTypes';
import { get as getEnv } from 'env-var';

export class EnvConfigAdapter implements ConfigPort {
    getString(key: ConfigKeys, required: boolean = true): Nullable<string> {
        return required ? getEnv(key).required().asString() : getEnv(key).asString();
    }

    getInt(key: ConfigKeys, required: boolean = true): Nullable<number> {
        return required ? getEnv(key).required().asInt() : getEnv(key).asInt();
    }

    getFloat(key: ConfigKeys, required: boolean = true): Nullable<number> {
        return required ? getEnv(key).required().asFloat() : getEnv(key).asFloat();
    }

    getBool(key: ConfigKeys, required: boolean = true): Nullable<boolean> {
        return required ? getEnv(key).required().asBool() : getEnv(key).asBool();
    }
}
