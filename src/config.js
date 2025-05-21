export const SPOTIFY_CONFIG = {
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  redirectUri: chrome.identity.getRedirectURL(),
  scopes: ['user-library-modify', 'user-library-read', 'playlist-modify-public', 'playlist-modify-private'],
}
