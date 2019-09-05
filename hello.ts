/* Non-SSL is simply App() */
import * as uWS from 'uWebSockets.js';
import { uApp } from './util/appwrapper';
import { jsonParserP } from './middleware/jsonparser';
import { MicroRequest } from './util/MicroRequest';
import indexController from './controller/indexController'
import { RequestMap } from './util/RequestMapper';
const port = 9001;
let listenSocket = null;
let shutdown = false;
// require('uWebSockets.js').SSLApp({

//     /* There are tons of SSL options */
//     key_file_name: 'misc/key.pem',
//     cert_file_name: 'misc/cert.pem',
    
//   })

const _app = uWS.App({
  key_file_name: 'misc/key.pem',
  cert_file_name: 'misc/cert.pem',
  passphrase: '1234'
})
const app = uApp(_app);
const router = new RequestMap({})

app
  .static(__dirname+'/assets', {
    maxCache: 1000
  })
  .use('/', indexController)
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
