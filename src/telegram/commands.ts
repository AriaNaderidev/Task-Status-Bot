import {
  generateOAuthState,
  getGitHubAuthorizationUrl,
} from "../github/oauth.js";
import { saveOAuthState } from "../oauth/state.js";
import type { TelegramMessage } from "../types/telegram.js";
import { sendMessage } from "./client.js";

// Process the supported bot commands from a Telegram message.
export async function handleMessage(message: TelegramMessage): Promise<void> {
  if (message.text === "/check") {
    await handleCheckCommand(message.chat.id);
    return;
  }

  if (message.text === "/connect") {
    await handleConnectCommand(message.chat.id);
  }
}

// Return the current GitHub status summary to the requesting chat.
async function handleCheckCommand(chatId: number): Promise<void> {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    await sendMessage(chatId, "GitHub username is not configured.");
    return;
  }

  // The issue and pull-request counts are placeholders until status checks are wired up.
  const text = [
    "🔍 GitHub Status",
    "",
    "Open Issues: 0",
    "Open PRs: 0",
  ].join("\n");

  await sendMessage(chatId, text);
}

// Create a GitHub OAuth link and associate its state with the requesting chat.
async function handleConnectCommand(chatId: number): Promise<void> {
  const state = generateOAuthState();
  saveOAuthState(state, chatId);

  const authUrl = getGitHubAuthorizationUrl(state);
  await sendMessage(chatId, `🔗 Connect your GitHub account:\n\n${authUrl}`);
}
