import { Event } from '@shared/core/events/Event';
import { User } from '../entities/User';

export class UserCreatedEvent extends Event {
    public readonly dateTimeOccured: Date;
    public readonly user: User;

    private constructor(dateTimeOccured: Date, user: User) {
        super();

        this.user = user;
        this.dateTimeOccured = dateTimeOccured;
    }

    public static create(dateTimeOccured: Date, user: User): UserCreatedEvent {
        return new UserCreatedEvent(dateTimeOccured, user);
    }
}
