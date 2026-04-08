// Questo è il Service Worker di base per 3L Creations
const CACHE_NAME = '3l-creations-v1';

// Quando l'app viene installata
self.addEventListener('install', (event) => {
    console.log('App 3L Creations installata con successo.');
    self.skipWaiting();
});

// Quando l'app viene aperta
self.addEventListener('fetch', (event) => {
    // Lasciamo che il sito comunichi normalmente con Internet e Firebase
    event.respondWith(fetch(event.request));
});
// Ascolta i messaggi push in arrivo
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: '3L Creations', body: 'Nuova notifica!' };
    
    const options = {
        body: data.body,
        icon: 'favicon.png', // L'icona della tua app
        badge: 'favicon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Cosa succede quando il cliente clicca sulla notifica
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
// === IMPORTAZIONI FIREBASE PER IL BACKGROUND ===
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Inizializza Firebase anche qui "dietro le quinte"
firebase.initializeApp({
  apiKey: "AIzaSyACRdFw2Ao9UbYw5O0h2PrA3n-CfoAgOLE",
  authDomain: "l-creations.firebaseapp.com",
  projectId: "l-creations",
  storageBucket: "l-creations.firebasestorage.app",
  messagingSenderId: "747374445759",
  appId: "1:747374445759:web:d9d7df4704ad81958f720a",
  measurementId: "G-N8W4K0XD7M"
});

const messaging = firebase.messaging();

// Cosa fare quando arriva un messaggio e l'app è chiusa
messaging.onBackgroundMessage(function(payload) {
  console.log('Ricevuta notifica in background: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'favicon.png', // La tua icona
    badge: 'favicon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
