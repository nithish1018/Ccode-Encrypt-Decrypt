export type Mode = 'encrypt' | 'decrypt';

export interface EncryptFormValues {
  cardNumber: string;
  pin: string;
  encryptionKey: string;
}

export interface DecryptFormValues {
  encryptedCode: string;
  encryptionKey: string;
}

export interface DecryptedPayload {
  cardNumber: string;
  pin: string;
}
