import React, {useState} from 'react'
import {Button, CircularProgress} from '@mui/material'
import {styled} from '@mui/material/styles'
import Main from './Main'

interface UserOauthDisplayProps {
  userAccessToken: string
  setUserAccessToken: (token: string) => void
}

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const CLIENT_ID = '68f4136733804885ad7b21f568e6da7d'
const SCOPES = [
  'user-library-modify',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
].join(' ')

const AuthContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '20px',
  textAlign: 'center',
})

const SpotifyLogo = styled('img')({
  width: '60px',
  height: '60px',
  marginBottom: '24px',
})

const StyledButton = styled(Button)({
  backgroundColor: '#1DB954',
  '&:hover': {
    backgroundColor: '#1ed760',
  },
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
})

const UserOauthDisplay: React.FC<UserOauthDisplayProps> = ({userAccessToken, setUserAccessToken}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSpotifyAuth = () => {
    setLoading(true)
    setError('')

    // Get Chrome's redirect URL
    const redirectUri = chrome.identity.getRedirectURL()

    const authUrl = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(SCOPES)}&response_type=token`

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
        <AuthContainer>
          <SpotifyLogo src="icons8-spotify-240.png" alt="Spotify Logo" />
          <h1>Sign In With Your Spotify Account</h1>
          {error && <div style={{color: 'red', margin: '10px 0'}}>{error}</div>}
          <StyledButton variant="contained" disabled={loading} onClick={handleSpotifyAuth}>
            {loading ? <CircularProgress size={24} /> : 'Sign in with Spotify'}
          </StyledButton>
        </AuthContainer>
      )}
    </>
  )
}

export default UserOauthDisplay
