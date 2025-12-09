const MAX_MESSAGE_LENGTH = 500;

/**
 * Ensures log messages are concise and free of sensitive context.
 */
export const sanitizeEventMessage = (message: string): string => {
  const normalized = message.replace(/\s+/g, ' ').trim();
  if (normalized.length <= MAX_MESSAGE_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_MESSAGE_LENGTH - 3)}...`;
};
