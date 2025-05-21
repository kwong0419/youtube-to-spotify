import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {CircularProgress, TextField, Button} from '@mui/material'
import MusicCard from './musicCard/MusicCard'
import {SpotifyTrack} from '../types/spotify'
import {styled} from '@mui/material/styles'

interface MainProps {
  userAccessToken: string
}

const getVideoTitle = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0]

      // If we can't get the tab, fall back to using tab title directly
      if (!tab?.id) {
        const tabTitle = tab?.title?.replace(' - YouTube', '').trim() || ''
        resolve(tabTitle)
        return
      }

      try {
        // Get title directly from tab title as a reliable fallback
        const tabTitle = tab.title?.replace(' - YouTube', '').trim() || ''
        resolve(tabTitle)
      } catch (error) {
        console.error('Error getting title:', error)
        reject(error)
      }
    })
  })
}

const Banner = styled('div')({
  padding: '20px',
  display: 'grid',
  gridTemplateColumns: '20px 20px 200px auto',
  gridGap: '20px',
  borderBottom: '2px solid snow',
})

const CloseButton = styled('img')({
  filter: 'invert(1)',
  width: '20px',
  height: '20px',
  '&:hover': {
    opacity: 0.4,
  },
})

const ProfileIcon = styled('img')({
  height: '25px',
  width: '25px',
})

const MainComponent = styled('div')({
  background: '#1E1E1E',
  backgroundBlendMode: 'screen',
  color: '#E0E0E0',
  width: '100%',
  height: '100%',
})

const MainContainer = styled('div')({
  backgroundColor: '#2D2D2D',
  width: '800px',
  minWidth: '800px',
  height: '100%',
  minHeight: '460px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
})

const SearchContainer = styled('div')({
  backgroundColor: '#363636',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  marginBottom: '12px',
  marginTop: '8px',
  width: '90%',
  alignSelf: 'center',
})

const SearchBarContainer = styled('div')({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  height: '40px', // Fixed height to prevent resizing
  margin: '0 auto',
})

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: '40px',
    backgroundColor: '#424242',
    color: '#E0E0E0',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#666666',
  },
  '& .MuiInputLabel-root': {
    color: '#B0B0B0',
  },
})

const ResultsContainer = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
  maxHeight: 'calc(100% - 80px)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
})

const Main: React.FC<MainProps> = ({userAccessToken}) => {
  const [musicResults, setMusicResults] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [userURI, setUserURI] = useState<string>('')

  const getYouTubeVideoInfo = (): void => {
    try {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0]

        if (!tab?.url?.includes('youtube.com/watch')) {
          setError('Not a YouTube video page')
          return
        }

        getVideoTitle()
          .then((title) => {
            // Clean up the title before setting and searching
            const cleanTitle = title.trim()
            setVideoTitle(cleanTitle)

            // Ensure we have a title before searching
            if (cleanTitle) {
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
      // First search request
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 10,
          market: 'US',
          fields: 'tracks.items(id,name,preview_url,artists,album,explicit,uri)', // Specify fields
        },
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      })

      // Try to get previews using track endpoint
      const tracksWithPreviews = await Promise.all(
        response.data.tracks.items.map(async (track: SpotifyTrack) => {
          // Always try to get a fresh track details
          try {
            const markets = ['US', 'GB', 'JP', 'DE', 'FR', 'AU', 'CA']
            for (const market of markets) {
              const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
                params: {market},
                headers: {
                  Authorization: `Bearer ${userAccessToken}`,
                },
              })
              if (trackResponse.data.preview_url) {
                return {...track, preview_url: trackResponse.data.preview_url}
              }
            }
          } catch (error) {
            console.error(`Failed to get preview for track ${track.id}:`, error)
          }
          return track
        }),
      )
      setMusicResults(tracksWithPreviews)
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
    <MainComponent>
      <MainContainer>
        <SearchContainer>
          <SearchBarContainer>
            <StyledTextField
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchSpotify(videoTitle)
                }
              }}
              label="Search term"
              variant="outlined"
              fullWidth
              size="small"
            />
            <Button
              onClick={() => searchSpotify(videoTitle)}
              variant="contained"
              color="primary"
              style={{
                height: '40px',
                whiteSpace: 'nowrap',
                minWidth: '120px',
              }}
            >
              Search Again
            </Button>
          </SearchBarContainer>
        </SearchContainer>

        {loading && (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <div
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
          <ResultsContainer>
            <MusicCard result={musicResults} userAccessToken={userAccessToken} userURI={userURI} />
          </ResultsContainer>
        )}
      </MainContainer>
    </MainComponent>
  )
}

export default Main
