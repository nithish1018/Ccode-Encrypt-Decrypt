import CryptoJS from 'crypto-js';

export function generateKeyAndIv(key: string) {
    const hash = CryptoJS.SHA512(key).toString();

    let hashedKey = '';
    let iv = '';

    for (let i = 0; i < hash.length; i++) {
        if (i % 4 === 0) {
            hashedKey += hash.substr(i, 1);
        }

        if (i % 8 === 0) {
            iv += hash.substr(i, 1);
        }
    }

    return { hashedKey, iv };
}

function getCipherParams(key: string) {
    const { hashedKey, iv } = generateKeyAndIv(key);

    // Use Latin1 (binary) parsing so each character maps to a single byte,
    // matching Node.js `crypto` when passing the string directly as the key/iv.
    return {
        key: CryptoJS.enc.Latin1.parse(hashedKey),
        iv: CryptoJS.enc.Latin1.parse(iv),
    };
}

export function encryptPayload(payload: string, key: string) {
    const { key: cipherKey, iv } = getCipherParams(key);

    return CryptoJS.AES.encrypt(payload, cipherKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
}

export function decryptPayload(payload: string, key: string) {
    const { key: cipherKey, iv } = getCipherParams(key);

    const decrypted = CryptoJS.AES.decrypt(payload, cipherKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encodeEncryptedValue(value: string) {
    return encodeURIComponent(value);
}

export function decodeEncryptedValue(value: string) {
    return decodeURIComponent(value);
}
