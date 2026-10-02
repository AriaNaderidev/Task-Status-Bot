// Telegram update fields used by this bot.
export interface TelegramMessage {
  chat: {
    id: number;
  };
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface TelegramUpdatesResponse {
  result: TelegramUpdate[];
}
