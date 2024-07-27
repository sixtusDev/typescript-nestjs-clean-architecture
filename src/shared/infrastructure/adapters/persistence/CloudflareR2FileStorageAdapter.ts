import { FileDate, FileStoragePort, FilePurpose } from '@shared/core/ports/FileStoragePort';
import { CompleteMultipartUploadCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';

export class CloudflareR2FileStorageAdapter implements FileStoragePort {
    constructor(
        private readonly s3Client: S3Client,
        private readonly logger: LoggerPort,
        private readonly config: ConfigPort,
    ) {}

    public async uploadFIle(purpose: FilePurpose, file: FileDate): Promise<string> {
        this.logger.log('Uplaoding file...', CloudflareR2FileStorageAdapter.name);

        const bucketName: string = this.getBucketName(purpose);
        const key: string = encodeURI(`uploads/${new Date().toISOString()}-${file.originalname}`);

        const upload: Upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });

        try {
            const response: CompleteMultipartUploadCommandOutput = await upload.done();

            this.logger.log('File upload completed', CloudflareR2FileStorageAdapter.name);

            // TODO: Return an appropriate response
            // return `https://${PersistenceConfig.R2_PUBLIC_DOMAIN}/${key}`;
            return response.Location;
        } catch (error) {
            this.logger.error(`File uplaod to cloudflare R2 failed`, CloudflareR2FileStorageAdapter.name, error);
            throw error;
        }
    }

    private getBucketName(purpose: FilePurpose): string {
        switch (purpose) {
            case FilePurpose.PROFILE:
                return this.config.getString(ConfigKeys.R2_PROFILE_BUCKET_NAME);
            case FilePurpose.CONTENT:
                return this.config.getString(ConfigKeys.R2_CONTENT_BUCKET_NAME);
            default:
                throw new Error(`Unknown strorage purpose ${purpose}`);
        }
    }
}
