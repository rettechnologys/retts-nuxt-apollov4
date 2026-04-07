import { createCipheriv, createDecipheriv } from 'crypto';
import { Buffer } from 'node:buffer';

const getConfig = () => {
  try {
    const config = useRuntimeConfig();
    return {
      algorithm: config.public.cryptoAlgorithm || 'aes-256-cbc',
      key: config.public.cryptoSecretKey || 'ed023713af7c856366d37171b84f7be2',
      iv: config.public.cryptoCipherIV || 'ed023713af7c8563',
    };
  } catch {
    return {
      algorithm: 'aes-256-cbc',
      key: 'ed023713af7c856366d37171b84f7be2',
      iv: 'ed023713af7c8563',
    };
  }
};

export  function encryptCrypto(data: string) {
  const { algorithm, key, iv } = getConfig();
  
  // Handle async crypto polyfill
  const cipher = createCipheriv(algorithm, key, iv);

  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
  ).toString();
}

export function decryptCrypto(data: string) {

  const buff = Buffer.from(data);
  const { algorithm, key, iv } = getConfig();
  
  // Handle async crypto polyfill
  const decipher = createDecipheriv(algorithm, key, iv);

  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  );
}
