export class Base64Utility {
    public static encode(str: string): string {
        const encoder: TextEncoder = new TextEncoder();
        const data: Uint8Array = encoder.encode(str);

        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(data)]));
    }

    public static decode(base64: string): string {
        const binaryString: string = atob(base64);

        const bytes: Uint8Array = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return new TextDecoder().decode(bytes);
    }
}
