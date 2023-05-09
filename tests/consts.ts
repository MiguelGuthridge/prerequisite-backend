import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT as string;
export const IP = process.env.IP as string;
export const URL = `http://${IP}:${PORT}`;

export default {
  PORT,
  IP,
  URL,
};
