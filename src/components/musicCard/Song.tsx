import {styled} from '@mui/material/styles'
import {Card, CardContent, CardMedia, Typography} from '@mui/material'

interface SongProps {
  title: string
  artist: string
  albumImg: string
  preview_url: string
  explicit: boolean
}

const StyledCard = styled(Card)({
  display: 'flex',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
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

const Cover = styled(CardMedia)({
  width: 100,
  height: 100,
  borderRadius: '4px',
  objectFit: 'cover',
})

const Controls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '16px',
  paddingBottom: '8px',
})

const ActionButtons = styled('div')({
  display: 'flex',
  gap: '8px',
  marginTop: '8px',
})

const Song: React.FC<SongProps> = ({title, artist, albumImg, preview_url, explicit}) => {
  return (
    <StyledCard>
      <Details>
        <Content>
          <Typography component="h2" variant="subtitle1">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {artist}
          </Typography>
          {explicit && (
            <Typography variant="subtitle2" color="text.secondary">
              E
            </Typography>
          )}
        </Content>
        <Controls>
          <audio controls>
            <source src={preview_url} type="audio/mpeg" />
          </audio>
        </Controls>
      </Details>
      <Cover sx={{width: 100, height: 100}} image={albumImg} title={`${title} album cover`} />
    </StyledCard>
  )
}

export default Song
