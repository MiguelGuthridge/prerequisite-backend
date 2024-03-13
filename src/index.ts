import app from './server';

const port = parseInt(process.env.PORT as string);
const ip = process.env.IP as string;

const server = app.listen(
  port,
  ip,
  () => console.log(`Waydriver backend running on http://${ip}:${port}/`)
);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
