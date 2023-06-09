import api from './api';

export const makeUser = async (num?: number | undefined) => {
  if (num === undefined) {
    num = 1;
  }
  return api.auth.register(`user${num}`, `User ${num}`, 'abc123ABC!');
};
