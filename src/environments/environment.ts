// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  websocket: 'ws://128.199.196.171:4000',
  endpoint: 'localhost',
  port: 3000,
  firebase: {
    apiKey: 'AIzaSyCAOdeDi_JEqsfc5RM_XUkgs1uBroPXQNw',
    authDomain: 'ceki-webrtc.firebaseapp.com',
    databaseURL: 'https://ceki-webrtc.firebaseio.com',
    projectId: 'ceki-webrtc',
    storageBucket: 'ceki-webrtc.appspot.com',
    messagingSenderId: '726054597856'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
