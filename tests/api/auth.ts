import { Token, UserId } from '../../src/types/user';
import { apiFetch } from './fetch';

export const register = async (username: string, displayName: string, password: string) => {
  return apiFetch(
    'POST',
    '/auth/register',
    undefined,
    { username, displayName, password }
  ) as Promise<{ id: UserId, token: Token }>;
};

export const login = async (username: string, password: string) => {
  return apiFetch(
    'POST',
    '/auth/login',
    undefined,
    { username, password }
  ) as Promise<{ id: UserId, token: Token }>;
};

export default {
  register,
  login,
};
