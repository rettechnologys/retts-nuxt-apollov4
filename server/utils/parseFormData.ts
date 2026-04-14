import { readMultipartFormData } from 'h3';
import type { H3Event } from 'h3';

/**
 * Reads a multipart/form-data request and returns a plain Record.
 * - File parts  → stored as `data:<mime>;base64,<b64>` strings
 * - Text parts  → JSON.parsed back to their original types
 */
export const parseFormData = async (
  event: H3Event,
): Promise<Record<string, any>> => {
  const parts = await readMultipartFormData(event);

  if (!parts?.length) return {};

  const data: Record<string, any> = {};

  for (const part of parts) {
    if (!part.name) continue;

    if (part.filename !== undefined) {
      // Binary field → base64 data URL
      const base64 = Buffer.from(part.data).toString('base64');
      data[part.name] =
        `data:${part.type ?? 'application/octet-stream'};base64,${base64}`;
    } else {
      // Text field → restore original JS value
      const raw = part.data.toString('utf-8');
      try {
        data[part.name] = JSON.parse(raw);
      } catch {
        data[part.name] = raw;
      }
    }
  }

  return data;
};
