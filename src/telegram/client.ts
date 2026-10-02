import { getRequiredEnv } from "../config.js";
import type {
  TelegramUpdate,
  TelegramUpdatesResponse,
} from "../types/telegram.js";

const telegramApiUrl = `https://api.telegram.org/bot${getRequiredEnv("TELEGRAM_BOT_TOKEN")}`;

// Send a text message to a Telegram chat.
export async function sendMessage(chatId: number, text: string): Promise<void> {
  const response = await fetch(`${telegramApiUrl}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }
}

// Request updates after the given offset using Telegram long polling.
export async function getUpdates(offset: number): Promise<TelegramUpdate[]> {
  const response = await fetch(
    `${telegramApiUrl}/getUpdates?offset=${offset}&timeout=30`,
  );

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  const data = (await response.json()) as TelegramUpdatesResponse;
  return data.result;
}
