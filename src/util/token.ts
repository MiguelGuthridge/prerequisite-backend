import { getData } from '../data/data';
import { UserId } from '../types/user';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export type TokenData = {
  sessionId: string
  userId: UserId
}

export const getAccessTokenSecret = () => {
  return process.env.ACCESS_TOKEN_SECRET as string;
};

export const generateToken = (id: UserId) => {
  const sessionId = crypto.randomUUID();
  // INVESTIGATE: Do we need to hash our session IDs for storage?
  getData().users[id].sessions.push(
    crypto
      .createHash('sha256')
      .update(sessionId)
      .digest()
      .toString()
  );
  const tokenData: TokenData = {
    sessionId,
    userId: id,
  };
  return jwt.sign(
    tokenData,
    getAccessTokenSecret(),
    { algorithm: 'HS256' }
  );
};
