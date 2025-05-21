import React, {useEffect, useState} from 'react'
import AddForm from '../AddForm'
import Song from './Song'
import axios from 'axios'
import '../../css/MusicCard.css'

interface SpotifyTrack {
  name: string
  artists: {name: string}[]
  album: {images: {url: string}[]}
  preview_url: string
  explicit: boolean
  uri: string
  id: string
}

const MusicCard = ({
  result,
  userAccessToken,
  userURI,
}: {
  result: SpotifyTrack[]
  userAccessToken: string
  userURI: string
}) => {
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      let res = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/me/playlists`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      })

      setPlaylists(res.data.items)
    } catch (error) {
      console.log(error)
    }
  }

  const display = result.map((song) => {
    return (
      <div className="individualMusicCardDiv">
        <div className="musicInfoDiv">
          <Song
            title={song.name}
            artist={song.artists[0].name}
            albumImg={song.album.images[1].url}
            preview_url={song.preview_url}
            explicit={song.explicit}
          />
        </div>
        <div className="addFormDiv">
          <AddForm
            uri={song.uri}
            song_id={song.id}
            userAccessToken={userAccessToken}
            userURI={userURI}
            playlists={playlists}
            fetchPlaylists={fetchPlaylists}
          />
        </div>
      </div>
    )
  })
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
      }}
    >
      {display}
    </div>
  )
}

export default MusicCard
