// Keep track of the Telegram chat that initiated each GitHub OAuth flow.
const oauthStates = new Map<string, number>();

// Associate a one-time OAuth state value with its requesting chat.
export function saveOAuthState(state: string, chatId: number): void {
  oauthStates.set(state, chatId);
}

// Find the chat associated with an OAuth state value.
export function getOAuthChatId(state: string): number | undefined {
  return oauthStates.get(state);
}

// Consume an OAuth state value so it cannot be reused.
export function removeOAuthState(state: string): void {
  oauthStates.delete(state);
}
