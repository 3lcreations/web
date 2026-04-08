// === 1. PRENDIAMO IL CONTROLLO PRIMA DI FIREBASE ===

self.addEventListener('push', function(event) {
    // 🛑 MAGIA: Questa riga blocca Firebase prima che possa agire
    event.stopImmediatePropagation();

    let payload = {};
    try { 
        payload = event.data.json(); 
    } catch(e) {}

    // Leggiamo quello che hai scritto nella console Firebase
    const title = payload?.notification?.title || "3L Creations";
    const options = {
        body: payload?.notification?.body || "Novità per te! ✨",
        icon: 'favicon.png',
        badge: 'favicon.png'
    };

    // Mostriamo la notifica forzatamente
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    // 🛑 Zittiamo Firebase anche al momento del click
    event.stopImmediatePropagation(); 
    event.notification.close();

    // L'UNICO LINK ESISTENTE
    const URL_SICURA = 'https://3lcreations.github.io/web/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.navigate(URL_SICURA).then(c => c.focus());
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(URL_SICURA);
            }
        })
    );
});

// === 2. IMPORTIAMO FIREBASE SOLO ALLA FINE ===
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyACRdFw2Ao9UbYw5O0h2PrA3n-CfoAgOLE",
  authDomain: "l-creations.firebaseapp.com",
  projectId: "l-creations",
  storageBucket: "l-creations.firebasestorage.app",
  messagingSenderId: "747374445759",
  appId: "1:747374445759:web:d9d7df4704ad81958f720a"
});

const messaging = firebase.messaging();
