import { redactPII } from '../safety/pii';

const MAX_MESSAGE_LENGTH = 500;

/**
 * Ensures log messages are concise and free of sensitive context.
 */
export const sanitizeEventMessage = (message: string): string => {
  const normalized = message.replace(/\s+/g, ' ').trim();
  const redacted = redactPII(normalized);
  if (redacted.length <= MAX_MESSAGE_LENGTH) {
    return redacted;
  }

  return `${redacted.slice(0, MAX_MESSAGE_LENGTH - 3)}...`;
};
