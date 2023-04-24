import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
  return {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
    },
    app: {
      port: parseInt(process.env.APP_PORT, 10),
    },
    freeCurrencyApi: {
      apiKey: process.env.FREE_CURRENCY_API_KEY,
    },
    zenotta: {
      storageNodeUrl: process.env.ZENOTTA_STORAGE_NODE_URL,
    },
    scraper: {
      blockPollingInterval: process.env.SCRAPER_BLOCK_POLLING_INTERVAL
        ? parseFloat(process.env.SCRAPER_BLOCK_POLLING_INTERVAL)
        : 60,
    },
  };
});
