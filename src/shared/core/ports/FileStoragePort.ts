export interface FileDate {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}

export enum FilePurpose {
    PROFILE = 'PROFILE',
    CONTENT = 'CONTENT',
}

export interface FileStoragePort {
    uploadFIle(purpose: FilePurpose, file: FileDate): Promise<string>;
}
