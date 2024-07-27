import { randomBytes } from 'crypto';

export class TokenUtil {
    private static readonly BASE62_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    public static generateVerificationCode(length: number = 6): string {
        return Array.from(
            { length },
            () => this.BASE62_CHARS[Math.floor(Math.random() * this.BASE62_CHARS.length)],
        ).join('');
    }

    public static generateSecureToken(byteLength: number = 32): string {
        return randomBytes(byteLength).toString('hex');
    }

    public static generateUrlSafeToken(byteLength: number = 32): string {
        return randomBytes(byteLength).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    public static generateTimeBasedToken(prefix: string = ''): string {
        const timestamp: string = Date.now().toString(36);
        const randomPart: string = Math.random().toString(36).substr(2, 5);

        return `${prefix}${timestamp}-${randomPart}`;
    }
}
