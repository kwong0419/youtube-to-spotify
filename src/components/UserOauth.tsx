import React, {useState} from 'react'
import {Button, CircularProgress} from '@mui/material'
import Main from './Main'

interface UserOauthDisplayProps {
  userAccessToken: string
  setUserAccessToken: (token: string) => void
}

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const CLIENT_ID = '68f4136733804885ad7b21f568e6da7d'
const SCOPES = 'user-library-modify user-library-read playlist-modify-public playlist-modify-private'

const UserOauthDisplay: React.FC<UserOauthDisplayProps> = ({userAccessToken, setUserAccessToken}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSpotifyAuth = () => {
    setLoading(true)
    setError('')

    // Get Chrome's redirect URL and log it
    const redirectUri = chrome.identity.getRedirectURL()
    console.log('Redirect URI:', redirectUri)

    const authUrl = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(SCOPES)}&response_type=token`
    console.log('Auth URL:', authUrl)

    chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Chrome Auth Error:', chrome.runtime.lastError)
        setError(`Auth Error: Please make sure ${redirectUri} is added to your Spotify App's Redirect URIs`)
        setLoading(false)
        return
      }

      if (response) {
        const token = new URLSearchParams(response.split('#')[1]).get('access_token')
        if (token) {
          setUserAccessToken(token)
          chrome.storage.local.set({spotifyToken: token})
        }
      }
      setLoading(false)
    })
  }

  return (
    <>
      {userAccessToken ? (
        <Main userAccessToken={userAccessToken} />
      ) : (
        <div className="auth-container">
          <h1>Sign In With Your Spotify Account</h1>
          {error && <div style={{color: 'red', margin: '10px 0'}}>{error}</div>}
          <Button variant="contained" color="primary" disabled={loading} onClick={handleSpotifyAuth}>
            {loading ? <CircularProgress size={24} /> : 'Sign in with Spotify'}
          </Button>
        </div>
      )}
    </>
  )
}

export default UserOauthDisplay
