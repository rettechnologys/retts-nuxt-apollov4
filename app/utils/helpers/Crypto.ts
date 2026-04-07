// Get config from Nuxt runtime config instead of import.meta.env
const getConfig = () => {
  try {
    const config = useRuntimeConfig();
    return {
      algorithm: config.cryptoAlgorithm || 'aes-256-cbc',
      key: config.cryptoSecretKey || 'ed023713af7c856366d37171b84f7be2',
      iv: config.cryptoCipherIv || 'ed023713af7c8563',
    };
  } catch {
    return {
      algorithm: 'aes-256-cbc',
      key: 'ed023713af7c856366d37171b84f7be2',
      iv: 'ed023713af7c8563',
    };
  }
};

// Helper functions for conversions
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  const buffer = new ArrayBuffer(uint8Array.length);
  const view = new Uint8Array(buffer);
  view.set(uint8Array);
  return buffer;
}

function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Clean and fix decrypted data
function cleanDecryptedString(str: string): string {
  try {
    let cleaned = str;

    // Remove null bytes and control characters
    cleaned = cleaned.replace(/[\x00-\x08\x0E-\x1F\x7F]/g, '');

    // Find the first '[' or '{' character which indicates start of JSON
    const jsonStart = Math.max(cleaned.indexOf('['), cleaned.indexOf('{'));

    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
      console.log(
        '[Crypto] Removed',
        jsonStart,
        'binary characters from start'
      );
    }

    // Handle escaped quotes - the data appears to be double-encoded
    if (cleaned.includes('\\"')) {
      console.log('[Crypto] Detected escaped quotes, fixing...');
      // Replace escaped quotes with regular quotes
      cleaned = cleaned.replace(/\\"/g, '"');
    }

    // Try to find and extract complete JSON
    // Look for the end of the JSON array or object
    let jsonEnd = -1;
    let braceCount = 0;
    let bracketCount = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        } else if (char === '[') {
          bracketCount++;
        } else if (char === ']') {
          bracketCount--;
        }

        // Check if we've closed all brackets/braces
        if (
          braceCount === 0 &&
          bracketCount === 0 &&
          (char === '}' || char === ']')
        ) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonEnd > 0) {
      cleaned = cleaned.substring(0, jsonEnd);
      console.log('[Crypto] Extracted complete JSON, length:', jsonEnd);
    }

    // Test if it's valid JSON
    try {
      JSON.parse(cleaned);
      console.log('[Crypto] Successfully parsed JSON');
      return cleaned;
    } catch (parseError) {
      console.log('[Crypto] JSON parse failed:', parseError);
      console.log('[Crypto] Cleaned string length:', cleaned.length);
      console.log('[Crypto] First 200 chars:', cleaned.substring(0, 200));
      console.log(
        '[Crypto] Last 200 chars:',
        cleaned.substring(Math.max(0, cleaned.length - 200))
      );

      // Try to fix common JSON issues
      // Remove trailing commas
      let fixed = cleaned.replace(/,(\s*[}\]])/g, '$1');

      // Try to close unclosed arrays/objects
      if (fixed.trim().endsWith(',')) {
        fixed = fixed.trim().slice(0, -1);
      }

      // Count opening vs closing brackets/braces
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;

      // Add missing closing brackets/braces
      for (let i = 0; i < openBraces - closeBraces; i++) {
        fixed += '}';
      }
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        fixed += ']';
      }

      try {
        JSON.parse(fixed);
        console.log('[Crypto] Successfully fixed and parsed JSON');
        return fixed;
      } catch (fixError) {
        console.log('[Crypto] Could not fix JSON:', fixError);
      }
    }

    return cleaned;
  } catch (error) {
    console.error('[Crypto] Error cleaning decrypted string:', error);
    return str;
  }
}

// Import crypto key for Web Crypto API
async function importKey(keyString: string): Promise<CryptoKey> {
  const keyBuffer = stringToArrayBuffer(keyString.slice(0, 32).padEnd(32, '0'));
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptCrypto(data: string): Promise<string> {
  try {
    const config = getConfig();
    const key = await importKey(config.key);

    // Fix IV handling - convert string to proper buffer
    const ivString = config.iv.slice(0, 16).padEnd(16, '0'); // IV should be 16 bytes for AES-CBC
    const iv = stringToArrayBuffer(ivString);

    const dataBuffer = stringToArrayBuffer(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      dataBuffer
    );

    return arrayBufferToHex(encrypted);
  } catch (error) {
    console.error('[Crypto] Web Crypto encryption error:', error);
    // Fallback to base64
    return btoa(data);
  }
}

export async function decryptCrypto(encryptedHex: string): Promise<string> {
  try {
    const config = getConfig();
    const key = await importKey(config.key);

    // Fix IV handling - convert string to proper buffer
    const ivString = config.iv.slice(0, 16).padEnd(16, '0'); // IV should be 16 bytes for AES-CBC
    const iv = stringToArrayBuffer(ivString);

    const encryptedBuffer = hexToArrayBuffer(encryptedHex);

    console.log('[Crypto] Decryption config:', {
      keyLength: config.key.length,
      ivLength: ivString.length,
      encryptedLength: encryptedHex.length,
    });

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      encryptedBuffer
    );

    const decryptedString = arrayBufferToString(decrypted);

    // Debug: Log the raw decrypted string
    console.log('[Crypto] Raw decrypted string length:', decryptedString.length);
    console.log(
      '[Crypto] Raw decrypted string preview:',
      decryptedString.substring(0, 200)
    );

    // Clean any binary garbage and fix double-encoding
    const cleanedString = cleanDecryptedString(decryptedString);
    console.log('[Crypto] Final cleaned string length:', cleanedString);

    return decryptedString;
  } catch (error) {
    console.error('[Crypto] Web Crypto decryption error:', error);

    // If Web Crypto fails, try the sync version as fallback
    try {
      const syncResult = decryptCryptoSync(encryptedHex);
      console.log(
        '[Crypto] Sync fallback result preview:',
        syncResult.substring(0, 200)
      );
      return cleanDecryptedString(syncResult);
    } catch (syncError) {
      console.error(
        '[Crypto] Sync decryption fallback also failed:',
        syncError
      );

      // Final fallback - try base64 decode
      try {
        return atob(encryptedHex);
      } catch {
        return encryptedHex;
      }
    }
  }
}

// Synchronous versions for backward compatibility (using simple encoding)
export function encryptCryptoSync(data: string): string {
  try {
    // Simple obfuscation for sync use
    const config = getConfig();
    const key = config.key.slice(0, 32).padEnd(32, '0');

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const encrypted = new Uint8Array(dataBytes.length);

    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i]! ^ key.charCodeAt(i % key.length);
    }

    return btoa(String.fromCharCode(...encrypted));
  } catch (error) {
    console.error('[Crypto] Sync encryption error:', error);
    return btoa(data);
  }
}

export function decryptCryptoSync(encryptedData: string): string {
  try {
    const config = getConfig();
    const key = config.key.slice(0, 32).padEnd(32, '0');

    const binaryString = atob(encryptedData);
    const encrypted = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      encrypted[i] = binaryString.charCodeAt(i);
    }

    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i]! ^ key.charCodeAt(i % key.length);
    }

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decrypted);

    // Clean any binary garbage and fix double-encoding
    return cleanDecryptedString(decryptedString);
  } catch (error) {
    console.error('[Crypto] Sync decryption error:', error);
    try {
      return atob(encryptedData);
    } catch {
      return encryptedData;
    }
  }
}

// Additional helper functions for backward compatibility
export const encryptDataSync = encryptCryptoSync;
export const decryptDataSync = decryptCryptoSync;
export const encryptCryptoAsync = encryptCrypto;
export const decryptCryptoAsync = decryptCrypto;
