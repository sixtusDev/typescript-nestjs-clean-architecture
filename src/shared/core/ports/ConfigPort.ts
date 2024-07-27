import { ConfigKeys } from '../constants/ConfigKeys';
import { Nullable } from '../types/UtilityTypes';

export interface ConfigPort {
    getString(key: ConfigKeys, required?: boolean): Nullable<string>;
    getInt(key: ConfigKeys, required?: boolean): Nullable<number>;
    getFloat(key: ConfigKeys, required?: boolean): Nullable<number>;
    getBool(key: ConfigKeys, required?: boolean): Nullable<boolean>;
}
