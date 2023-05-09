import { apiFetch } from './fetch';

const echo = async (value: string) => {
  return apiFetch('GET', '/debug/echo', undefined, { value }) as Promise<{ value: string }>;
};

const clear = async () => {
  return apiFetch('DELETE', '/debug/clear');
};

export default {
  echo,
  clear,
};
