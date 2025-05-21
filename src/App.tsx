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
    chrome.storage.sync.get(['SK'], (result) => {
      if (result.SK) {
        setUserAccessToken(result.SK)
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
