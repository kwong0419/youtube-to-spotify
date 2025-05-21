import {styled} from '@mui/material/styles'
import {Card, CardContent, Typography} from '@mui/material'

interface SongProps {
  title: string
  artist: string
  explicit: boolean
  uri: string
}

const StyledCard = styled(Card)({
  display: 'flex',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  backgroundColor: '#424242',
  height: 'fit-content',
  width: '100%',
})

const Details = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 auto',
  gap: '8px',
})

const Content = styled(CardContent)({
  flex: '1 0 auto',
  padding: '8px 16px !important',
})

const Controls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '16px',
  paddingBottom: '8px',
})

const PlayerContainer = styled('div')({
  width: '100%',
  height: '80px',
  borderRadius: '4px',
  overflow: 'hidden',
})

const SongTitle = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 500,
  color: '#E0E0E0',
})

const ArtistName = styled(Typography)({
  fontSize: '0.875rem',
  color: '#B0B0B0',
})

const ExplicitLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: '#909090',
  backgroundColor: '#505050',
  padding: '2px 6px',
  borderRadius: '3px',
  display: 'inline-block',
  marginTop: '4px',
})

const Title = styled(Typography)({
  color: 'white',
  fontWeight: 700,
  fontSize: '1.5em',
  marginBottom: 0,
  alignItems: 'center',
})

const Artist = styled(Typography)({
  fontSize: '15px',
  fontWeight: 500,
  marginTop: 0,
})

const Song: React.FC<SongProps> = ({title, artist, explicit, uri}) => {
  const embedUrl = `https://open.spotify.com/embed/track/${uri.split(':')[2]}?utm_source=generator&theme=0`

  return (
    <StyledCard>
      <Details>
        <Content>
          <SongTitle>{title}</SongTitle>
          <ArtistName>{artist}</ArtistName>
          {explicit && <ExplicitLabel>EXPLICIT</ExplicitLabel>}
        </Content>
        <Controls>
          <PlayerContainer>
            <iframe
              style={{borderRadius: '12px'}}
              src={embedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </PlayerContainer>
        </Controls>
      </Details>
    </StyledCard>
  )
}

export default Song
