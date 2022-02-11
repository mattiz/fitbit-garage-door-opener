import * as document from "document";
import { peerSocket } from "messaging";


const statusLabel = document.getElementById("statusLabel");
const openButton = document.getElementById("openButton");

statusLabel.text = 'Waiting for phone..';


/**
 * Listen for messages from phone
 */
peerSocket.onmessage = (evt) => {
  console.log(`Got message from phone: ${evt.data}`);

  if( evt.data === 'COMPANION_UP' ) {
    statusLabel.text = 'Ready!';
  }
  
  if( evt.data === 'OK' ) {
    statusLabel.text = 'Door open!';
  }
  
  if( evt.data === 'ERROR' ) {
    statusLabel.text = 'HTTP failed!';
  }
}


/**
 * Error communicating with phone
 */
peerSocket.onerror = (err) => {
  console.error(`Connection error with phone: ${err.code} - ${err.message}`);
}


/**
 * Listen for button clicks
 */
openButton.addEventListener("click", (evt) => {
  console.log("Max message size=" + peerSocket.MAX_MESSAGE_SIZE);
  
  if (peerSocket.readyState === peerSocket.OPEN) {
    console.log('Sending open message to phone');
    statusLabel.text = 'Opening door..';

    try {
      peerSocket.send("OPEN");
    } catch (e) {
      console.error(`Failed sending message to phone: ${e}`);
    }

  } else {
    console.error('peerSocket is not open on client');
    statusLabel.text = 'Socket not open';
  }
})
