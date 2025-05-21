chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, {type: 'NEW_VIDEO'})
  }
})

chrome.alarms.create('refreshToken', {periodInMinutes: 45})

chrome.alarms.onAlarm.addListener(async (alarm: chrome.alarms.Alarm) => {
  if (alarm.name === 'refreshToken') {
    const {spotifyToken} = await chrome.storage.local.get('spotifyToken')
    if (spotifyToken) {
      // Implement token refresh logic here
    }
  }
})
