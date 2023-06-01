import server from './server';

const port = parseInt(process.env.PORT as string);
const ip = process.env.IP as string;

server.listen(
  port,
  ip,
  () => console.log(`Prerequisite backend running on http://${ip}:${port}/`)
);
