import React, {useState, SyntheticEvent} from 'react'

import axios from 'axios'
import {Snackbar, Alert as MuiAlert, Button} from '@mui/material'
import {styled} from '@mui/material/styles'

interface AddFormProps {
  uri: string
  song_id: string
  userAccessToken: string
  userURI: string
  playlists: Array<{id: string; name: string}>
  fetchPlaylists: () => Promise<void>
}

const FormPlaylist = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
})

const PlaylistButton = styled(Button)({
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: '#1a8e46',
  border: 'none',
  color: '#ffffff',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '11px',
  padding: '6px 12px',
  minWidth: '180px', // Changed from width to minWidth and increased
  height: '32px',
  cursor: 'pointer',
  margin: '5px',
  position: 'relative',
  overflow: 'visible', // Changed from hidden to visible
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#146c35',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  '& span': {
    display: 'inline-block',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    width: 'auto', // Added to ensure text isn't cut off
    '&:after': {
      content: '"\\002b"',
      position: 'absolute',
      top: '0',
      right: '-20px',
      opacity: 0,
      transition: 'all 0.3s ease-in-out',
    },
  },
  '&:hover span': {
    paddingRight: '25px',
    '&:after': {
      opacity: 1,
      right: '0',
      transform: 'translateX(0)',
    },
  },
})

const LibraryButton = styled(Button)({
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: '#5a1487',
  border: 'none',
  color: '#ffffff',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '11px',
  padding: '6px 12px',
  minWidth: '180px', // Changed from width to minWidth and increased
  height: '32px',
  cursor: 'pointer',
  margin: '5px',
  position: 'relative',
  overflow: 'visible', // Changed from hidden to visible
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#461069',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  '& span': {
    display: 'inline-block',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    width: 'auto', // Added to ensure text isn't cut off
    '&:after': {
      content: '"\\002b"',
      position: 'absolute',
      top: '0',
      right: '-20px',
      opacity: 0,
      transition: 'all 0.3s ease-in-out',
    },
  },
  '&:hover span': {
    paddingRight: '25px',
    '&:after': {
      opacity: 1,
      right: '0',
      transform: 'translateX(0)',
    },
  },
})

const PlaylistMessage = styled('div')({
  color: 'lawngreen',
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  visibility: 'hidden',
  '&.visible': {
    opacity: 1,
    visibility: 'visible',
  },
})

const LibraryMessage = styled('div')({
  color: 'skyblue',
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  visibility: 'hidden',
  '&.visible': {
    opacity: 1,
    visibility: 'visible',
  },
})

const Select = styled('select')({
  borderRadius: '0.5em',
  backgroundColor: '#424242',
  color: '#E0E0E0',
  border: '1px solid #666666',
  padding: '8px',
  marginBottom: '10px',
  width: '100%', // Ensure full width
  '&:focus': {
    outline: 'none',
    borderColor: '#888888',
  },
  '& option': {
    padding: '8px',
    backgroundColor: '#424242',
    color: '#E0E0E0',
  },
  // Style the dropdown itself
  '& optgroup, & option': {
    backgroundColor: '#424242',
  },
})

const AddDiv = styled('div')({
  position: 'relative',
  width: '100%',
})

const AddForm: React.FC<AddFormProps> = ({uri, song_id, userAccessToken, userURI, playlists, fetchPlaylists}) => {
  const [currentPlaylist, setCurrentPlaylist] = useState('')
  const [showNewPlayList, setShowNewPlayList] = useState('none')
  const [nameNewPlayList, setNameNewPlayList] = useState('')
  const [togglePlaylistMessage, setTogglePlaylistMessage] = useState(false)
  const [toggleLibraryMessage, setToggleLibraryMessage] = useState(false)
  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleSnackbarClose = (event: Event | SyntheticEvent<any, Event>, reason: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  const handleAlertClose = (event: SyntheticEvent<Element, Event>) => {
    setOpen(false)
  }

  //handle selected playlist
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPlaylist(e.target.value)
    e.target.value === 'new' ? setShowNewPlayList('block') : setShowNewPlayList('none')
  }

  //create new playlist
  const addNewPlayList = async () => {
    try {
      // Get user profile first to get the correct user ID
      const userResponse = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          Authorization: 'Bearer ' + userAccessToken,
        },
      })

      console.log('Creating new playlist...')
      // Use the user ID directly from the profile
      let res = await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/users/${userResponse.data.id}/playlists`,
        headers: {
          Authorization: 'Bearer ' + userAccessToken,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          name: nameNewPlayList,
          description: 'New playlist',
          public: false,
        }),
      })

      let newID = res.data.id

      // Add a small delay to ensure Spotify's API has processed the new playlist
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fetch playlists first to ensure we have the latest data
      await fetchPlaylists()

      // Then add the song to the playlist
      await addSongtoPlaylist(newID, true)

      // Reset form after everything is complete
      setShowNewPlayList('none')
      setNameNewPlayList('')
      setCurrentPlaylist('')
    } catch (error) {
      console.error('Error creating playlist:', error)
    }
  }

  //add song to a playlist
  const addSongtoPlaylist = async (playlistID: string, isNewPlaylist = false) => {
    try {
      await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${uri}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      })

      //hide playlist input
      setSnackbarMessage(isNewPlaylist ? 'Playlist Created and song added!' : 'Your Song has been added to Playlist!')
      setOpen(true)
      //success message
      setTogglePlaylistMessage(true)
      setTimeout(() => setTogglePlaylistMessage(false), 2000) // Hide after 2 seconds
      // reloads playlist
      fetchPlaylists()
    } catch (error) {
      console.error('Error adding song to playlist:', error)
    }
  }

  //handle the add submit based on new or exisiting playlist
  const handleSubmitPlaylist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentPlaylist === 'new') {
      addNewPlayList()
    } else {
      addSongtoPlaylist(currentPlaylist)
    }
  }

  //handle add to library submit
  const handleClickLibrary = async () => {
    try {
      await axios({
        method: 'put',
        url: `https://api.spotify.com/v1/me/tracks?ids=${song_id}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      })
      setSnackbarMessage('Song added to your Library!')
      setOpen(true)
      setToggleLibraryMessage(true)
      setTimeout(() => setToggleLibraryMessage(false), 2000) // Hide after 2 seconds
      await setCurrentPlaylist('')
    } catch (error) {
      console.log(error)
    }
  }

  //display add form component
  return (
    <AddDiv>
      <FormPlaylist>
        <Select onChange={handleSelect} id="playlistSelect" value={currentPlaylist}>
          <option value="" disabled>
            Select a Playlist
          </option>
          <option value="new">Create New Playlist</option>
          {playlists?.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </Select>
        <input
          placeholder="New Playlist"
          style={{display: showNewPlayList, paddingTop: 5}}
          onChange={(e) => {
            setNameNewPlayList(e.target.value)
          }}
          required
        />
        <div id="addBtn" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <PlaylistButton
            type="submit"
            style={{verticalAlign: 'middle', marginTop: '10px'}}
            onClick={handleSubmitPlaylist}
          >
            <span>Add to Playlist</span>
          </PlaylistButton>
          <LibraryButton onClick={handleClickLibrary} type="button" style={{verticalAlign: 'middle'}}>
            <span>Add to Library</span>
          </LibraryButton>
        </div>
      </FormPlaylist>

      <PlaylistMessage className={togglePlaylistMessage ? 'visible' : ''}>Added to Playlist!</PlaylistMessage>
      <LibraryMessage className={toggleLibraryMessage ? 'visible' : ''}>Added to Library!</LibraryMessage>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleAlertClose} severity="success" elevation={6} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </AddDiv>
  )
}

export default AddForm
