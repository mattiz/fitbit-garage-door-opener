import * as messaging from "messaging";
import { me } from "companion";
import { settingsStorage } from "settings";


messaging.peerSocket.onerror = (err) => {
  console.log(`Connection error with clock: ${err.code} - ${err.message}`);
}


messaging.peerSocket.onmessage = (evt) => {
  console.log(`Got message from clock: ${evt.data}`);
  openGarageDoor();
}


function openGarageDoor() {
  if( !me.permissions.granted("access_internet")) {
    console.log("App not allowed to access the internet.");
    return;
  }

  const relayIp = JSON.parse(settingsStorage.getItem("relayIp")).name;
  
  const url = `http://${relayIp}/relay/0?turn=on`;
  console.log('URL: ' + url);
  
  fetch(url)
    .then(function(res) {
    return res.json();
    
  }).then(function(data) {
    console.log('DATA: ' + data.timer_remaining);
    sendMessage('OK');
    
  }).catch(function(error) {
    console.log(`error in API call: ${error}`);
    sendMessage('ERROR');
  });
}


function sendMessage(obj) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(obj);
  }
}
