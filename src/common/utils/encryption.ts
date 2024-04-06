import * as crypto from 'crypto';
import * as fs from 'fs';
export const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    process.env.ENCRYPTIONKEY,
    process.env.ENCRYPTIONIV,
  );
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return encryptedData;
};

export const decrypt = (data: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    process.env.ENCRYPTIONKEY,
    process.env.ENCRYPTIONIV,
  );
  let decryptedData = decipher.update(data, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

// Generate RSA key pair
const { privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Key size
  publicKeyEncoding: {
    type: 'pkcs1', // Public key format
    format: 'pem', // Encoding
  },
  privateKeyEncoding: {
    type: 'pkcs1', // Private key format
    format: 'pem', // Encoding
    cipher: 'aes-256-cbc', // Encryption algorithm
    passphrase: 'topSecret', // Passphrase for encrypting the private key (optional)
  },
});

fs.writeFileSync('src/config/private.pem', privateKey);
