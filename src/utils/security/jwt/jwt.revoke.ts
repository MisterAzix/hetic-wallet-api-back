const revokedTokens = new Set<string>();

function revokeToken(token: string) {
  revokedTokens.add(token);
}

function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}