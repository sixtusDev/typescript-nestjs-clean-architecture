import 'module-alias/register';
import { Application } from '@shared/presentation/Application';

async function bootstrap(): Promise<void> {
    const app: Application = Application.create();
    await app.run();
}

bootstrap();
