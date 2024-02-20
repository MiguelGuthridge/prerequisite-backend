import { IsRevoked } from 'express-jwt';
import { getData } from '../data/data';
import { UserId } from '../types/user';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request as JWTRequest } from 'express-jwt';
import { hash } from './hash';

export type TokenData = {
  sessionId: string
  userId: UserId
}

export const getAccessTokenSecret = () => {
  return process.env.ACCESS_TOKEN_SECRET as string;
};

/**
 * Generates a token for the given user
 * @param id ID of user to generate token for
 * @returns a new JWT token
 */
export const generateToken = (id: UserId) => {
  const sessionId = crypto.randomUUID();
  // INVESTIGATE: Do we need to hash our session IDs for storage?
  getData().users[id].sessions.push(hash(sessionId));
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

/**
 * Given a request, revoke the token associated with the request
 * @param req Request object
 */
export const revokeToken = (req: JWTRequest) => {
  const { userId, sessionId } = req.auth as TokenData;
  const sessions = getData().users[userId].sessions;
  sessions.splice(sessions.indexOf(hash(sessionId)));
};

export const isTokenRevoked: IsRevoked = async (req, jwt) => {
  if (jwt === undefined) {
    return true;
  }
  const { userId, sessionId } = jwt.payload as TokenData;

  try {
    // Whether the session is still present in that user's list
    return !getData().users[userId].sessions.includes(hash(sessionId));
  } catch {
    return true;
  }
};

export const getUserIdFromRequest = (req: JWTRequest): UserId => {
  return (req.auth as TokenData).userId;
};
