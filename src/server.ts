import { createServer, type ServerResponse } from "node:http";
import {
  getAuthenticatedUser,
  getUserRepositories,
} from "./github/api.js";
import { exchangeCodeForToken } from "./github/oauth.js";
import {
  getOAuthChatId,
  removeOAuthState,
} from "./oauth/state.js";

// Write a plain-text HTTP response with the specified status code.
function sendText(
  response: ServerResponse,
  statusCode: number,
  message: string,
): void {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain",
  });
  response.end(message);
}

// Handle the one-time GitHub OAuth redirect and load the connected account.
async function handleGitHubCallback(
  requestUrl: string,
  response: ServerResponse,
): Promise<void> {
  const url = new URL(requestUrl, "http://localhost:3000");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    sendText(response, 400, "Invalid GitHub OAuth callback");
    return;
  }

  const telegramChatId = getOAuthChatId(state);
  if (!telegramChatId) {
    sendText(response, 400, "Invalid or expired OAuth state");
    return;
  }

  removeOAuthState(state);

  try {
    const tokenData = await exchangeCodeForToken(code);
    const user = await getAuthenticatedUser(tokenData.access_token);
    const repositories = await getUserRepositories(tokenData.access_token);

    console.log("Telegram chat ID:");
    console.log(telegramChatId);

    console.log("GitHub user:");
    console.log(user.login);

    console.log("Accessible repositories:");
    console.log(repositories.map((repository) => repository.full_name));

    sendText(response, 200, "GitHub connected successfully!");
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    sendText(response, 500, "GitHub authentication failed");
  }
}

// Start the HTTP server responsible for GitHub's OAuth callback.
export function startOAuthServer(): void {
  const server = createServer(async (request, response) => {
    if (request.url?.startsWith("/auth/github/callback")) {
      await handleGitHubCallback(request.url, response);
      return;
    }

    sendText(response, 404, "Not found");
  });

  server.listen(3000, () => {
    console.log("HTTP server running on http://localhost:3000");
  });
}
