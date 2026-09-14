import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'local-form-safety',
        configureServer(server) {
          if (env.FORMS_PROXY_TARGET) return;
          server.middlewares.use('/api/lead', (_req, res) => {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              message: 'Локальная сборка: отправка не подключена. Данные не отправлены. Свяжитесь с организатором.',
            }));
          });
        },
      },
    ],
    base: env.VITE_BASE_PATH || '/',
    server: {
      host: '127.0.0.1',
      ...(env.FORMS_PROXY_TARGET ? { proxy: { '/api/lead': { target: env.FORMS_PROXY_TARGET, changeOrigin: true } } } : {}),
    },
    preview: { host: '127.0.0.1' },
    build: { target: 'es2022' },
  };
});
