import {useEffect, useState} from 'react'
import AddForm from '../AddForm'
import Song from './Song'
import axios from 'axios'
import {SpotifyTrack} from '../../types/spotify'
import {styled} from '@mui/material/styles'

const IndividualMusicCardDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#363636',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
  width: '720px',
  margin: '0 auto',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
})

const MusicInfoDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  padding: '12px',
  flex: 3,
  marginRight: '12px',
})

const AddFormDiv = styled('div')({
  padding: '12px',
  minWidth: '100px',
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const ResultsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
  padding: '0 16px',
  overflowX: 'hidden',
})

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

  const display = result.map((song) => (
    <IndividualMusicCardDiv key={song.id}>
      <MusicInfoDiv>
        <Song title={song.name} artist={song.artists[0].name} explicit={song.explicit} uri={song.uri} />
      </MusicInfoDiv>
      <AddFormDiv>
        <AddForm
          uri={song.uri}
          song_id={song.id}
          userAccessToken={userAccessToken}
          userURI={userURI}
          playlists={playlists}
          fetchPlaylists={fetchPlaylists}
        />
      </AddFormDiv>
    </IndividualMusicCardDiv>
  ))

  return <ResultsContainer>{display}</ResultsContainer>
}

export default MusicCard
