console.log("brackground script running")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "new") {
    console.log("newed")
    try{
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id, allFrames: true },
        files: ["new.js"],
      })
    }catch(e){
      console.log(e)
    }
  }

  if (message.message === "exist") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id, allFrames: true },
        files: ["exist.js"],
      })
  }
});

chrome.runtime.onStartup.addListener( () => {
  console.log(`onStartup()`);
});

chrome.webNavigation.onCompleted.addListener((details) => { 
  if (details.url) {
      chrome.storage.local.get(["url"]).then((res)=>{
          if(res.url.includes(new URL(details.url).hostname)){
            chrome.scripting.executeScript(
              {
                target: { tabId: details.tabId },
                files: ["webpage.js"],
              })
          }
      })
  }
}, { url: [{ urlMatches: 'http://.*' }, { urlMatches: 'https://.*' }] });

/*
chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            { header: 'X-Frame-Options', operation: 'remove' },
            { header: 'Content-Security-Policy', operation: 'remove' },
            { header: 'Cross-Origin-Resource-Sharing', operation: 'set', value: "*" }
          ],
        },
        condition: {
          urlFilter: '*',
          resourceTypes: ['main_frame','sub_frame'],
        },
      },
    ]
  }); 
chrome.browsingData.remove({}, {
    serviceWorkers: true,
    cacheStorage: true,
  });
chrome.tabs.onCreated.addListener((tab) => {
  console.log(tab.url)
  chrome.storage.local.get(["url"]).then(async(result) => {
    if(result.url.includes(new URL(tab.url).hostname)){
      if (tab.mutedInfo.muted) {
        chrome.tabs.update(activeTab.id, { muted: false });
      }
    }
  })
}); */