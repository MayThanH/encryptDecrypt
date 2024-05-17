import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.key');
const publicKeyPath = path.join(__dirname, '..', 'keys', 'public.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export class EncryptionService {
  generateAESKey(length = 32) {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  encryptAES(payload: string, aesKey: string) {
    return CryptoJS.AES.encrypt(payload, aesKey).toString();
  }

  encryptRSA(data: string, key: string) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
      { key: key, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer,
    );
    return encrypted.toString('base64');
  }

  encryptData(payload: string) {
    const aesKey = this.generateAESKey();
    const data2 = this.encryptAES(payload, aesKey);
    const data1 = this.encryptRSA(aesKey, publicKey);
    return { data1, data2 };
  }

  decryptAES(encryptedData: string, aesKey: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  decryptRSA(encryptedData: string, key: string) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      { key: key, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer,
    );
    return decrypted.toString('utf8');
  }

  decryptData(data1: string, data2: string) {
    const aesKey = this.decryptRSA(data1, privateKey);
    const payload = this.decryptAES(data2, aesKey);
    return payload;
  }
}
