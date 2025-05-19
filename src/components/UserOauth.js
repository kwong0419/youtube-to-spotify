import React, {useState, useEffect} from 'react'
import Main from './Main'
import axios from 'axios'

import {makeStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import {green} from '@material-ui/core/colors'
import {red} from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },

  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))
/* global chrome */

const CLIENT_ID = encodeURIComponent('68f4136733804885ad7b21f568e6da7d')
const RESPONSE_TYPE = encodeURIComponent('token')
//local redirect--Below--
const REDIRECT_URI = encodeURIComponent('https://ahcigmedajhdjdoigkkjhmlkjpajoafj.chromiumapp.org/')
//live redirect --Below--
// const REDIRECT_URI = encodeURIComponent(
//   "https://dfjdbnkpphnaohmlnmjhjkjeheaaojon.chromiumapp.org/"
// );
const SCOPE = encodeURIComponent(
  'ugc-image-upload playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private user-read-playback-position user-read-recently-played user-top-read user-modify-playback-state user-read-currently-playing user-read-playback-state user-read-private user-read-email user-library-modify user-library-read user-follow-modify user-follow-read streaming app-remote-control',
)
const SHOW_DIALOG = encodeURIComponent('true')
let STATE = ''
let ACCESS_TOKEN = ''

let user_signed_in = false

const create_spotify_endpoint = () => {
  STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15))

  let oauth2_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${SCOPE}
&show_dialog=${SHOW_DIALOG}
`

  return oauth2_url
}

const UserOauthDisplay = ({userAccessToken, setUserAccessToken}) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const timer = React.useRef()

  const userOauthFlow = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_spotify_endpoint(),
        interactive: true,
      },

      function (redirect_url) {
        if (chrome.runtime.lastError) {
          //   sendResponse({ message: "fail" });

          console.log(chrome.runtime.lastError)
        } else {
          if (redirect_url.includes('callback?error=access_denied')) {
            // sendResponse({ message: "fail" });
          } else {
            handleKey(redirect_url)
          }
        }
      },
    )
    return ACCESS_TOKEN
  }

  const handleKey = (redirect_url) => {
    ACCESS_TOKEN = redirect_url.substring(redirect_url.indexOf('access_token=') + 13)

    ACCESS_TOKEN = ACCESS_TOKEN.substring(0, ACCESS_TOKEN.indexOf('&'))
    let state = redirect_url.substring(redirect_url.indexOf('state=') + 6)
    chrome.storage.sync.set({SK: ACCESS_TOKEN}, function () {})
    if (state === STATE) {
      console.log('SUCCESS')
      user_signed_in = true
      setTimeout(() => {
        ACCESS_TOKEN = ''
        user_signed_in = false
        chrome.storage.sync.set({SK: ''}, function () {})
      }, 100000)

      chrome.browserAction.setPopup({popup: './index.html'}, () => {})
    }
  }

  const handleClick = async () => {
    userOauthFlow()

    setSuccess(false)
    setLoading(true)
  }

  return (
    <>
      {userAccessToken.length ? (
        <Main userAccessToken={userAccessToken} />
      ) : (
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <div>
              <body>
                <h1>Sign In With Your Spotify Account To Use This Extension</h1>
                {/* <button onClick={handleClick} id="sign-in">
              Sign In
            </button> */}
              </body>
            </div>
            <Button
              variant="contained"
              color="primary"
              // className={buttonClassname}
              disabled={loading}
              onClick={handleClick}
            >
              sign in
              {loading && <CircularProgress size={20} className={classes.buttonProgress} />}
            </Button>
            {loading ? <p>use pop-up to sign in</p> : null}
          </div>
        </div>
      )}
    </>
  )
}

export default UserOauthDisplay
