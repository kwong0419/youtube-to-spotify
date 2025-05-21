import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CircularProgress, TextField, Button} from '@mui/material'
import MusicCard from './musicCard/MusicCard'

interface MainProps {
  userAccessToken: string
}

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{name: string}>
  album: {
    images: Array<{url: string}>
  }
  preview_url: string
  explicit: boolean
  uri: string
}

const getVideoTitle = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0]

      // If we can't get the tab, fall back to using tab title directly
      if (!tab?.id) {
        const tabTitle = tab?.title?.replace(' - YouTube', '').trim() || ''
        console.log('Falling back to tab title (no tab id):', tabTitle)
        resolve(tabTitle)
        return
      }

      try {
        // Get title directly from tab title as a reliable fallback
        const tabTitle = tab.title?.replace(' - YouTube', '').trim() || ''
        console.log('Got title from tab:', tabTitle)
        resolve(tabTitle)
      } catch (error) {
        console.error('Error getting title:', error)
        reject(error)
      }
    })
  })
}

const Main: React.FC<MainProps> = ({userAccessToken}) => {
  const [musicResults, setMusicResults] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [userURI, setUserURI] = useState<string>('')

  const getYouTubeVideoInfo = (): void => {
    try {
      console.log('Starting YouTube video info extraction...')

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0]

        console.log('Current tab:', {
          url: tab?.url,
          title: tab?.title,
        })

        if (!tab?.url?.includes('youtube.com/watch')) {
          console.log('Not a YouTube video page. URL:', tab?.url)
          setError('Not a YouTube video page')
          return
        }

        getVideoTitle()
          .then((title) => {
            console.log('Retrieved video title:', title)
            // Clean up the title before setting and searching
            const cleanTitle = title.trim()
            setVideoTitle(cleanTitle)

            // Ensure we have a title before searching
            if (cleanTitle) {
              console.log('Starting Spotify search for:', cleanTitle)
              searchSpotify(cleanTitle)
            } else {
              setError('Could not get video title')
            }
          })
          .catch((error) => {
            console.error('Error getting video title:', error)
            setError(error instanceof Error ? error.message : 'An error occurred')
          })
      })
    } catch (error) {
      console.error('Error in getYouTubeVideoInfo:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const searchSpotify = async (query: string): Promise<void> => {
    setLoading(true)
    try {
      console.log('Searching Spotify with query:', query)
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      })

      console.log('Spotify search results:', response.data.tracks.items)
      setMusicResults(response.data.tracks.items)

      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {Authorization: `Bearer ${userAccessToken}`},
      })
      setUserURI(userResponse.data.uri)
    } catch (error) {
      console.error('Spotify search error:', error)
      setError('Failed to search Spotify')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getYouTubeVideoInfo()
  }, [])

  return (
    <div className="main-container">
      <div
        className="search-container"
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <TextField
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          label="Search term"
          variant="outlined"
          fullWidth
          size="small"
        />
        <Button
          onClick={() => searchSpotify(videoTitle)}
          variant="contained"
          color="primary"
          style={{whiteSpace: 'nowrap'}}
        >
          Search Again
        </Button>
      </div>

      {loading && (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{
            color: 'red',
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      {musicResults.length > 0 && (
        <div className="results-container">
          <MusicCard result={musicResults} userAccessToken={userAccessToken} userURI={userURI} />
        </div>
      )}
    </div>
  )
}

export default Main
