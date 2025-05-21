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
  '&:focus': {
    outline: 'none',
    borderColor: '#888888',
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
    //post request takes / userURI /name/

    try {
      let res = await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/users/${userURI.split('user:')[1]}/playlists`,
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
      //id of new playlist created
      let newID = res.data.id
      // waits for res and uses playlist id to add song
      await addSongtoPlaylist(newID)
    } catch (error) {
      console.log(error)
    }
  }

  //add song to a playlist
  const addSongtoPlaylist = async (playlistID: string) => {
    console.log('addSongPl' + playlistID)

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
      setOpen(true)
      //success message
      setTogglePlaylistMessage(true)
      setTimeout(() => setTogglePlaylistMessage(false), 2000) // Hide after 2 seconds
      // reloads playlist
      fetchPlaylists()
    } catch (error) {
      console.log(error)
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
        <Select onChange={handleSelect} id="playlistSelect">
          <option value="" selected disabled>
            Select a Playlist
          </option>
          <option value="new" key="1">
            Create New Playlist
          </option>
          {playlists.map((playlist) => {
            return (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            )
          })}
        </Select>
        <input
          placeholder="Youtube Playlist"
          style={{display: showNewPlayList, paddingTop: 5}}
          onChange={(e) => {
            setNameNewPlayList(e.target.value)
          }}
          required
        />
        <div id="addBtn" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <PlaylistButton type="submit" style={{verticalAlign: 'middle'}} onClick={handleSubmitPlaylist}>
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
          Your Song has been added!
        </MuiAlert>
      </Snackbar>
    </AddDiv>
  )
}

export default AddForm
