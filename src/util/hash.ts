import crypto from 'crypto';

export const hash = (value: string) => crypto
  .createHash('sha256')
  .update(value)
  .digest()
  .toString();
