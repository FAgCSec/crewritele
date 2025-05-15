import { defineConfig } from 'astro/config';
import auth from "auth-astro";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  integrations: [auth()],
  adapter: vercel({
    mode: 'standalone',
  }),
  vite: {
    server: {
      https: {
        key: './localhost-key.pem',
        cert: './localhost.pem',
      }
    }
  },
});
