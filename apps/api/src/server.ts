import { createApp } from "./app.js";
import { env } from "./env.js";
import { logger } from "./lib/logger.js";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`ZENKRAFT API listening on http://localhost:${env.port}`);
});
