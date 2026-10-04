import { handleMessage } from "./commands.js";
import { getUpdates } from "./client.js";

// Poll Telegram for updates and dispatch supported message commands.
async function pollUpdates(offset: number): Promise<number> {
  try {
    const updates = await getUpdates(offset);

    for (const update of updates) {
      console.log("New update:");
      console.log(JSON.stringify(update, null, 2));

      if (update.message) {
        try {
          await handleMessage(update.message);
        } catch (error) {
          console.error("Polling error:", error);
        }
      }
      offset = update.update_id + 1;
    }
  } catch (error) {
    console.error("Fetch updates error:", error);
  }

  return offset;
}

// Start the bot and continuously poll Telegram for updates.
export async function startBot(): Promise<void> {
  console.log("Bot is running...");

  let offset = 0;
  while (true) {
    offset = await pollUpdates(offset);
  }
}
