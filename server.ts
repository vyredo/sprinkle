/* Non-SSL is simply App() */
import * as uWS from 'uWebSockets.js';
const port = 9001;
let listenSocket = null;
let shutdown = false;
// require('uWebSockets.js').SSLApp({

//     /* There are tons of SSL options */
//     key_file_name: 'misc/key.pem',
//     cert_file_name: 'misc/cert.pem',
    
//   })


const APP = uWS.App({
    key_file_name: 'misc/key.pem',
    cert_file_name: 'misc/cert.pem',
    passphrase: '1234'
});

APP.get('/*',  (res, req) => {
    res.writeHeader('Content-Type', 'application/json');
    const t = {hello: 'vody'}
    res.end(JSON.stringify(t));
}).get('/shutdown', (res, req) => {
    shutdown = true;
    if (listenSocket) {
      res.end('Okay, shutting down now!');
      /* This function is provided directly by µSockets */
      uWS.us_listen_socket_close(listenSocket);
      listenSocket = null;
    } else {
      /* We just refuse if alrady shutting down */
      res.close();
    }
  })
.listen(port, (token) => {
    /* Save the listen socket for later shut down */
    listenSocket = token;
    /* Did we even manage to listen? */
    if (token) {
      console.log('Listening to port ' + port);
  
      /* Stop listening soon */
      if(shutdown){
        setTimeout(() => {
            console.log('Shutting down now');
            uWS.us_listen_socket_close(listenSocket);
            listenSocket = null;
          }, 1000);
      }
    } else {
      console.log('Failed to listen to port ' + port);
    }
  });