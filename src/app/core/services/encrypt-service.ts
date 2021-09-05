import { Injectable } from '@angular/core';
import { AES, enc, lib } from 'crypto-js';
import { environment } from 'src/environments/environment';

/**
 * A service that provides AES encryption and decryption for text.
 */
@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  /**
   * Converts a plain text string into an AES-encrypted ciphertext string.
   * @param plaintext The plaintext to encrypt.
   * @returns the ciphertext result of the encrypted plaintext.
   */
  public encrypt(plaintext: string): string {
    const cipher: lib.CipherParams = AES.encrypt(plaintext, this.getKey());
    return cipher.toString();
  }

  /**
   * Converts a ciphertext string into a UTF-8 encoded plaintext string.
   * @param ciphertext The ciphertext to decrypt.
   * @returns The plaintext result of the decrypted ciphertext.
   */
  public decrypt(ciphertext: string): string {
    const bytes: lib.WordArray = AES.decrypt(ciphertext, this.getKey());
    return bytes.toString(enc.Utf8);
  }

  private getKey(): string {
    return environment.app.tokenEncryptKey;
  }
}
