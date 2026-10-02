import type {
  GitHubRepository,
  GitHubSearchResponse,
  GitHubUser,
} from "../types/github.js";

const GITHUB_API = "https://api.github.com";

// Fetch JSON from GitHub and surface HTTP errors to the caller.
async function githubFetch<T>(url: string, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

// Count open issues assigned to a user across the selected repositories.
export async function getOpenAssignedIssues(
  username: string,
  repos: string[],
): Promise<number> {
  const results = await Promise.all(
    repos.map((repo) => {
      const query = encodeURIComponent(
        `repo:${repo} assignee:${username} is:open is:issue`,
      );

      return githubFetch<GitHubSearchResponse>(
        `${GITHUB_API}/search/issues?q=${query}`,
      );
    }),
  );

  return results.reduce((total, result) => total + result.total_count, 0);
}

// Count open pull requests authored by a user across the selected repositories.
export async function getOpenPullRequests(
  username: string,
  repos: string[],
): Promise<number> {
  const results = await Promise.all(
    repos.map((repo) => {
      const query = encodeURIComponent(
        `repo:${repo} author:${username} is:open is:pr`,
      );

      return githubFetch<GitHubSearchResponse>(
        `${GITHUB_API}/search/issues?q=${query}`,
      );
    }),
  );

  return results.reduce((total, result) => total + result.total_count, 0);
}

// Retrieve the GitHub account associated with an OAuth access token.
export async function getAuthenticatedUser(
  accessToken: string,
): Promise<GitHubUser> {
  return githubFetch<GitHubUser>(`${GITHUB_API}/user`, accessToken);
}

// Retrieve repositories visible to the authenticated GitHub account.
export async function getUserRepositories(
  accessToken: string,
): Promise<GitHubRepository[]> {
  return githubFetch<GitHubRepository[]>(
    `${GITHUB_API}/user/repos?per_page=100`,
    accessToken,
  );
}
