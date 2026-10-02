// GitHub API fields consumed by the OAuth callback and status checks.
export interface GitHubUser {
  login: string;
}

export interface GitHubRepository {
  full_name: string;
}

export interface GitHubSearchResponse {
  total_count: number;
}

export interface GitHubTokenResponse {
  access_token: string;
}
