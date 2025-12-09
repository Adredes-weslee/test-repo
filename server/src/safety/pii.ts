const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phoneRegex = /\b(?:\+?\d[\d\s().-]{6,}\d)\b/g;
const idLikeRegex = /\b(?:[STFG]\d{7}[A-Z]|\d{8,})\b/gi;

const redactEmail = (text: string): string => text.replace(emailRegex, '[redacted email]');
const redactPhone = (text: string): string => text.replace(phoneRegex, '[redacted phone]');
const redactIdLike = (text: string): string => text.replace(idLikeRegex, '[redacted id]');

export const redactPII = (text: string): string => {
  if (typeof text !== 'string' || !text) return text;

  let redacted = text;
  redacted = redactEmail(redacted);
  redacted = redactPhone(redacted);
  redacted = redactIdLike(redacted);

  return redacted;
};

const redactValue = (value: unknown, cache: WeakMap<object, unknown>): unknown => {
  if (typeof value === 'string') {
    return redactPII(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => redactValue(entry, cache));
  }

  if (value && typeof value === 'object') {
    if (value instanceof Date || value instanceof RegExp) {
      return value;
    }

    const cached = cache.get(value);
    if (cached) return cached;

    const clone: Record<string, unknown> = {};
    cache.set(value, clone);

    Object.entries(value).forEach(([key, val]) => {
      clone[key] = redactValue(val, cache);
    });

    return clone;
  }

  return value;
};

export const redactPIIDeep = <T>(value: T): T => {
  const cache = new WeakMap<object, unknown>();
  return redactValue(value as unknown, cache) as T;
};
