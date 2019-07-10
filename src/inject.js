import { extractHostName, detectBrowser } from './popup/utils/helper';


if(typeof navigator.clipboard == 'undefined') {
    redirectToWarning(extractHostName(window.location.href),window.location.href)
} else {
    sendToBackground('phishingCheck',{ hostname:extractHostName(window.location.href), href:window.location.href })    
}
let aepp = chrome.runtime.getURL("aepp.js")
fetch(aepp)
.then(res => res.text())
.then(res => {
    injectScript(res)
})
// Subscribe from postMessages from page
function evnt() {
    return new Promise((resolve, reject) => {
        let ev = 
        console.log(resolve)
        window.dispatchEvent(ev)
    })
}
window.addEventListener("message", ({data}) => {
    let method = "pageMessage";
    if(typeof data.method != "undefined") {
        method = data.method
    }
    // Handle message from page and redirect to background script
    sendToBackground(method,data)
    .then(res => {
        if(method == 'aeppMessage') {
            let e = new CustomEvent('ReceiveWalletResponse', {
                detail: res
            })
            window.dispatchEvent(e)
        }
    })
}, false)

// Handle message from background and redirect to page
chrome.runtime.onMessage.addListener(({ data }, sender, sendResponse) => {
    console.log(data)
    if(data.method == 'phishingCheck') {
        if(data.blocked) {
            redirectToWarning(data.params.hostname,data.params.href,data.extUrl)
        }
    }
})

const redirectToWarning = (hostname,href,extUrl = '') => {
    window.stop()
    let extensionUrl = 'chrome-extension'
    if(detectBrowser() == 'Firefox') {
        extensionUrl = 'moz-extension'
    }
    let redirectUrl = ''
    if(extUrl != '') {
        redirectUrl = `${extUrl}phishing/phishing.html#hostname=${hostname}&href=${href}`
    }else {
        redirectUrl = `${extensionUrl}://${chrome.runtime.id}/phishing/phishing.html#hostname=${hostname}&href=${href}`
    }
    window.location.href = redirectUrl
    return
}

const injectScript = (content) => {
    try {
      const container = document.head || document.documentElement
      const scriptTag = document.createElement('script')
      scriptTag.setAttribute('async', false)
      scriptTag.textContent = content
      container.insertBefore(scriptTag, container.children[0])
    //   container.removeChild(scriptTag)
    } catch (e) {
      console.error('Waellet script injection failed', e)
    }
}

function sendToBackground(method, params) {
    return new Promise((resolve,reject) => {
        chrome.runtime.sendMessage({
            jsonrpc: "2.0",
            id: null,
            method,
            params
        },(res) => {
            resolve(res)
        })
    })
}

// Render
function render(data) {
    // @TODO create list with sdks and his transaction with ability to accept/decline signing
}

function clickSign({target, value}) {
    const [sdkId, tx] = target.id.split['-'];
    signResponse({value, sdkId, tx})
}

function signResponse({value, sdkId, tx}) {
    sendToBackground('txSign', {value, sdkId, tx})
}