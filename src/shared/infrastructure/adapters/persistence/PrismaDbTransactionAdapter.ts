import { DbTransactionPort } from '@shared/core/ports/dbTransactionPort';
import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';
import { LoggerPort } from '@shared/core/ports/LoggerPort';

export class PrismaDbTransactionAdapter implements DbTransactionPort {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly logger: LoggerPort,
    ) {}

    public async run<T>(operation: (transaction: Omit<PrismaClient, ITXClientDenyList>) => Promise<T>): Promise<T> {
        try {
            return await this.prisma.$transaction(async (prismaTransaction) => {
                return await operation(prismaTransaction);
            });
        } catch (error) {
            this.logger.error('Transaction rolled back!', PrismaDbTransactionAdapter.name, error);
            throw error;
        }
    }
}
