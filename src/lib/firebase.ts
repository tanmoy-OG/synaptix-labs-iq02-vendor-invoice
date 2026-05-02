// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSB1d41zwViYbT40DEWmdn88OlcosLWHs',
  authDomain: 'synaptix-user-data.firebaseapp.com',
  databaseURL: 'https://synaptix-user-data-default-rtdb.firebaseio.com',
  projectId: 'synaptix-user-data',
  storageBucket: 'synaptix-user-data.appspot.com',
  messagingSenderId: '1063709047082',
  appId: '1:1063709047082:web:c3604b9d472df339c50653',
};

// Initialize Firebase only once
let app: ReturnType<typeof initializeApp> | undefined;

declare global {
  interface Window {
    _firebaseApp?: ReturnType<typeof initializeApp>;
  }
}

if (!window._firebaseApp) {
  app = initializeApp(firebaseConfig);
  window._firebaseApp = app;
} else {
  app = window._firebaseApp;
}

// Export auth and provider for use in components
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
