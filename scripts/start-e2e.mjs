import { spawn } from 'node:child_process';

// Explicitly blank every production service setting: these browser tests never contact real Firebase.
const env = { ...process.env, VITE_BASE_PATH: '/Wedding/', VITE_SITE_URL: 'http://127.0.0.1:4173/Wedding/', VITE_BACKGROUND_MUSIC_SRC: '' };
for (const key of ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID', 'MEASUREMENT_ID', 'APPCHECK_SITE_KEY']) env[`VITE_FIREBASE_${key}`] = '';
const build = spawn('npm', ['run', 'build', '--', '--mode', 'e2e', '--outDir', '.e2e-dist'], { stdio: 'inherit', env });
let server;
build.on('exit', code => {
  if (code !== 0) { process.exitCode = code ?? 1; return; }
  server = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--mode', 'e2e', '--outDir', '.e2e-dist', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'inherit', env });
  server.on('exit', status => { process.exitCode = status ?? 0; });
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { build.kill(signal); server?.kill(signal); });
