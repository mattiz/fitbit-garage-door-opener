import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { peerSocket } from "messaging";


peerSocket.onerror = (err) => {
  console.log(`Connection error with phone: ${err.code} - ${err.message}`);
}

peerSocket.onmessage = (evt) => {
  console.log(`Got message from phone: ${evt.data}`);
  
  if( evt.data == 'OK' ) {
    statusLabel.text = 'Door open!';
  }
  
  if( evt.data == 'ERROR' ) {
    statusLabel.text = 'HTTP failed!';
  }
}



const statusLabel = document.getElementById("statusLabel");
const openButton = document.getElementById("openButton");

statusLabel.text = 'Ready';

openButton.addEventListener("click", (evt) => {
  console.log("Max message size=" + peerSocket.MAX_MESSAGE_SIZE);
  
  if (peerSocket.readyState === peerSocket.OPEN) {
    console.log('Sending open message to clock');
    statusLabel.text = 'Opening door..';
    peerSocket.send("OPEN");
  } else {
    console.log('peerSocket is not open on client');
  }
})
