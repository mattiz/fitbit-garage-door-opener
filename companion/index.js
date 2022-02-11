import * as messaging from "messaging";
import { me } from "companion";
import { settingsStorage } from "settings";


/**
 * Error communicating with clock
 */
messaging.peerSocket.onerror = (err) => {
  console.error(`Connection error with clock: ${err.code} - ${err.message}`);
}


/**
 * Opening communication with clock
 */
messaging.peerSocket.onopen = (evt) => {
  console.log(`Socket to clock is open`);
  sendMessage("COMPANION_UP");
}


/**
 * Listen for messages from clock
 */
messaging.peerSocket.onmessage = (evt) => {
  console.log(`Got message from clock: ${evt.data}`);
  openGarageDoor();
}


function openGarageDoor() {
  if( !me.permissions.granted("access_internet")) {
    console.error("App not allowed to access the internet.");
    return;
  }

  const relayIp = JSON.parse(settingsStorage.getItem("relayIp")).name;
  
  const url = `http://${relayIp}/relay/0?turn=on`;
  console.log(`Sending request to URL: ${url}`);
  
  fetch(url)
    .then(function(res) {
    return res.json();
    
  }).then(function(data) {
    console.log('Data from relay: ' + JSON.stringify(data));
    sendMessage('OK');
    
  }).catch(function(error) {
    console.error(`Error in API call: ${error}`);
    sendMessage('ERROR');
  });
}


function sendMessage(obj) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(obj);
  }
}
