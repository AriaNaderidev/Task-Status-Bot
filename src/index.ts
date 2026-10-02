import "dotenv/config";
import { startBot } from "./telegram/bot.js";
import { startOAuthServer } from "./server.js";

// Start the HTTP callback server and the Telegram long-polling loop.
startOAuthServer();
startBot();
