import { Role, RoleNames } from '@prisma/client';
import { randomUUID } from 'crypto';
import { defaultSeedValues } from './seed';

export const rolesSeed: Role[] = [
    {
        ...defaultSeedValues,
        id: randomUUID(),
        name: RoleNames.ADMIN,
        description: 'User with this role has the previledge to perform all actions in the system',
    },
    {
        ...defaultSeedValues,
        id: randomUUID(),
        name: RoleNames.USER,
        description: 'User with this role has the previledge to only learn on the platform',
    },
    {
        ...defaultSeedValues,
        id: randomUUID(),
        name: RoleNames.CONTENT_CREATOR,
        description: 'User with this role has the priviledge to both learn and create contents for language learning',
    },
    {
        ...defaultSeedValues,
        id: randomUUID(),
        name: RoleNames.MODERATOR,
        description: 'User with this role can both learn and moderate on the community section of the platform',
    },
];
