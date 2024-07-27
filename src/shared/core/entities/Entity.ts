import { Nullable, Optional } from '../types/UtilityTypes';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ClassValidationDetails, ClassValidatorUtil } from '../utils/ClassValidatorUtil';
import { CoreError } from '../errors/CoreError';
import { CoreCodeDescriptions } from '../constants/CoreCodeDescriptions';
import { UniqueId } from '../value-objects/UniqueId';

export interface EntityProps {
    id?: UniqueId;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}

export abstract class Entity {
    protected readonly id: UniqueId;

    @IsDate()
    protected readonly createdAt: Date;

    @IsOptional()
    @IsDate()
    protected updatedAt: Nullable<Date>;

    @IsOptional()
    @IsString()
    protected readonly createdBy: Nullable<string>;

    @IsOptional()
    @IsString()
    protected updatedBy: Nullable<string>;

    @IsOptional()
    @IsDate()
    protected deletedAt: Nullable<Date>;

    @IsOptional()
    @IsString()
    protected deletedBy: Nullable<string>;

    constructor(props?: EntityProps) {
        this.id = props.id ?? UniqueId.create();
        this.createdAt = props.createdAt ?? new Date();
        this.createdBy = props.createdBy ?? null;
        this.updatedAt = props.updatedAt ?? null;
        this.updatedBy = props.updatedBy ?? null;
        this.deletedAt = props.deletedAt ?? null;
        this.deletedBy = props.deletedBy ?? null;
    }

    public get getId(): UniqueId {
        return this.id;
    }

    public get getCreatedAt(): Nullable<Date> {
        return this.createdAt;
    }

    public get getUpdatedAt(): Nullable<Date> {
        return this.updatedAt;
    }

    public get getCreatedBy(): Nullable<string> {
        return this.createdBy;
    }

    public get getUpdatedBy(): Nullable<string> {
        return this.updatedBy;
    }

    public get getDeletedAt(): Nullable<Date> {
        return this.deletedAt;
    }

    public get getDeletedBy(): Nullable<string> {
        return this.deletedBy;
    }

    public validate(): void {
        const errors: Optional<ClassValidationDetails> = ClassValidatorUtil.validate(this);
        if (errors) {
            throw CoreError.create({ codeDescription: CoreCodeDescriptions.ENTITY_VALIDATION_ERROR, data: errors });
        }
    }
}
