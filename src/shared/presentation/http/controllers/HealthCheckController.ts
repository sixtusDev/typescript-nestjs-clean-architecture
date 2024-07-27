import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { PrismaClient } from '@prisma/client';

@ApiTags('Health Check')
@Controller('health')
export class HealthCheckController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
        private readonly db: PrismaHealthIndicator,
        @Inject(CoreDITokens.CONFIG)
        private readonly config: ConfigPort,
        private readonly prisma: PrismaClient,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'This API is used for checking the health status of the application' })
    check() {
        return this.health.check([
            () => this.http.pingCheck('documentation', this.config.getString(ConfigKeys.HEALTH_HTTP_URL)),
            () => this.db.pingCheck('database', this.prisma),
            () =>
                this.disk.checkStorage('storage', {
                    path: '/',
                    thresholdPercent: this.config.getFloat(ConfigKeys.HEALTH_STORAGE_THRESHOLD_IN_PERCENT),
                }),
            () =>
                this.memory.checkHeap('memory_heap', this.config.getInt(ConfigKeys.HEALTH_HEAP_MEMORY_THRESHOLD_IN_MB)),
            () => this.memory.checkRSS('memory_rss', this.config.getInt(ConfigKeys.HEALTH_RSS_MEMORY_THRESHOLD_IN_MB)),
        ]);
    }
}
