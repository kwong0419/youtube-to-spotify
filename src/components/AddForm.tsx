import React, {useState, SyntheticEvent} from 'react'

import axios from 'axios'
import '../css/AddForm.css'
import {Snackbar, Alert as MuiAlert} from '@mui/material'

interface AddFormProps {
  uri: string
  song_id: string
  userAccessToken: string
  userURI: string
  playlists: Array<{id: string; name: string}>
  fetchPlaylists: () => Promise<void>
}

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
    console.log('on change ' + e.target.value)
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
      await setCurrentPlaylist('')
    } catch (error) {
      console.log(error)
    }
  }

  //display add form component
  return (
    <div className="addDiv">
      <form id="formPlaylist">
        <select onChange={handleSelect} className="playlist" id="playlistSelect">
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
        </select>
        <input
          placeholder="Youtube Playlist"
          style={{display: showNewPlayList, paddingTop: 5}}
          onChange={(e) => {
            setNameNewPlayList(e.target.value)
          }}
          required
        />
        <div id="addBtn" style={{display: 'flex', flexDirection: 'row'}}>
          <button
            id="playlistBtn"
            className="playlistBtn"
            type="submit"
            style={{verticalAlign: 'middle'}}
            onClick={handleSubmitPlaylist}
          >
            <span>Add to Playlist</span>
          </button>
          <button
            id="libraryBtn"
            className="libraryBtn"
            onClick={handleClickLibrary}
            type="button"
            style={{verticalAlign: 'middle'}}
          >
            <span>Add to Library</span>
          </button>
        </div>
      </form>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleAlertClose} severity="success" elevation={6} variant="filled">
          Your Song has been added!
        </MuiAlert>
      </Snackbar>
    </div>
  )
}

export default AddForm
