import React, {useState, useEffect} from 'react'
import ErrorPage from './components/ErrorPage'
import UserOauthDisplay from './components/UserOauth'
import './App.css'

const App: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [userAccessToken, setUserAccessToken] = useState<string>('')

  const fetchWindow = (): void => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      const url = tabs[0].url
      if (url) setCurrentUrl(url)
    })
  }

  useEffect(() => {
    fetchWindow()
    chrome.storage.local.get(['spotifyToken'], (result) => {
      if (result.spotifyToken) {
        setUserAccessToken(result.spotifyToken)
      }
    })
  }, [])

  return (
    <div className="App">
      {currentUrl.includes('youtube') ? (
        <UserOauthDisplay userAccessToken={userAccessToken} setUserAccessToken={setUserAccessToken} />
      ) : (
        <ErrorPage />
      )}
    </div>
  )
}

export default App
