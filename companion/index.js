import * as messaging from "messaging";
import { me } from "companion";
import { settingsStorage } from "settings";

let RELAY_IP = 'unset';

// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
  RELAY_IP = JSON.parse(settingsStorage.getItem("relayIp")).name;
  console.log(`SETTING CHANGED OFFLINE: ${REPLAY_IP}`);
}

settingsStorage.addEventListener("change", (evt) => {
  RELAY_IP = JSON.parse(evt.newValue).name;
  console.log(`SETTING CHANGED ONLINE: ${REPLAY_IP}`);
});


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
  
  const url = `http://${RELAY_IP}/relay/0?turn=on`;
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


function getAtlasData(){
  if (!me.permissions.granted("access_internet")) {
   console.log("We're not allowed to access the internet :-(");
   return; }

  const url="https://data.mongodb-a";
  const APIKEY = "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefg" ; 

  const payload = { dataSource: "Cluster0", database: "Fitbit", 
                    collection: "data" , filter: { _id: "watch1"}, 
                    projection: {_id:0}};

  const myHeaders = new Headers({'Content-Type': 'application/json',
                                  'api-key': APIKEY})

  const plstring = JSON.stringify(payload)
         
  fetch(url,{method: "POST",headers: myHeaders, body: plstring })
      .then(res => {if(res.status==200) { return res.json()} 
                            else return {"error":res.status}} )
      .then(data => {sendMessage(data.document);})
      .catch(e => console.log(`error in API call: ${e}`));
}

function sendMessage(obj) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(obj);
  }
}