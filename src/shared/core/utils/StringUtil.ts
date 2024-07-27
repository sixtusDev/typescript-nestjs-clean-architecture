import { NumbersUtil } from './NumbersUtil';

export class StringUtil {
    public static generateRandomUsername(): string {
        const adjectives: string[] = [
            'swift',
            'silent',
            'brave',
            'bright',
            'calm',
            'cool',
            'fierce',
            'gentle',
            'happy',
            'kind',
        ];
        const nouns: string[] = ['eagle', 'lion', 'tiger', 'wolf', 'fox', 'bear', 'hawk', 'panda', 'shark', 'whale'];

        const adjective: string = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun: string = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber: number = NumbersUtil.generateRandomNumber();

        return `${adjective}${noun}${randomNumber}`;
    }

    public static isValidEmail(email: string): boolean {
        const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(email);
    }
}
