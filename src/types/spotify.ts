export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{name: string}>
  album: {
    images: Array<{url: string}>
  }
  preview_url: string | null
  explicit: boolean
  uri: string
}
