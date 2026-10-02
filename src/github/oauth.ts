import crypto from "node:crypto";
import { getRequiredEnv } from "../config.js";
import type { GitHubTokenResponse } from "../types/github.js";

const GITHUB_CLIENT_ID = getRequiredEnv("GITHUB_CLIENT_ID");
const GITHUB_CLIENT_SECRET = getRequiredEnv("GITHUB_CLIENT_SECRET");
const GITHUB_CALLBACK_URL = getRequiredEnv("GITHUB_CALLBACK_URL");

// Generate a cryptographically random value to protect the OAuth callback flow.
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Build the GitHub authorization URL for the configured OAuth application.
export function getGitHubAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "repo",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// Exchange a GitHub authorization code for an access token.
export async function exchangeCodeForToken(
  code: string,
): Promise<GitHubTokenResponse> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_CALLBACK_URL,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub OAuth error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as GitHubTokenResponse;
}
