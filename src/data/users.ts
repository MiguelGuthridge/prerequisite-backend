import { User, UserId } from '../types/user';
import { getData } from './data';

export const getUserById = (id: UserId): User | null => {
  const u = getData().users[id];
  return u === undefined ? null : u;
};

export const getUserByUsername = (username: string): User | null => {
  for (const u of Object.values(getData().users)) {
    if (u.username === username) {
      return u;
    }
  }
  return null;
};
