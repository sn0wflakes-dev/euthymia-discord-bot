import { Hono } from 'hono'
import { createBot, startBot } from './bot'
import { log } from './config/logging';
import { env } from './config/env';
import { serve } from 'bun';

const client = createBot();

startBot(client).catch((error) => {
  log.error(`Failed to starting bot`, error);
  process.exit(1);
});

const app = new Hono();

app.get("/", (c) => c.text("Euthymia Bot is running"));

app.get("/health", (c) =>
  c.json({
    status: "ok",
    bot: client.isReady() ? "connected" : "connecting",
    uptime: process.uptime(),
  })
);

serve({
  port: env.PORT,
  fetch: app.fetch
});

log.info(`Server is running on port ${env.PORT}`);


