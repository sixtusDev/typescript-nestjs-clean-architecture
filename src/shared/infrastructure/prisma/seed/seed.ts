import { createSeedClient } from '@snaplet/seed';
import { rolesSeed } from './RolesSeed';

export const defaultSeedValues = {
    createdAt: new Date(),
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
    deletedBy: null,
    deletedAt: null,
};

const main = async () => {
    const seed = await createSeedClient();

    await seed.$resetDatabase();

    await seed.role(rolesSeed);

    console.log('🌱 Database seeded successfully!');

    process.exit();
};

main();
