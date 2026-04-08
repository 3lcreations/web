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

// Forza il Service Worker a prendere il controllo immediatamente
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const options = {
    body: payload.data?.body || "Novità in arrivo! ✨",
    icon: 'favicon.png',
    badge: 'favicon.png',
    data: { url: 'https://3lcreations.github.io/web/' }
  };
  return self.registration.showNotification(payload.data?.title || "3L Creations", options);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // L'UNICA DESTINAZIONE POSSIBILE
    const URL_SICURO = 'https://3lcreations.github.io/web/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se c'è una scheda aperta, la forziamo ad andare all'URL sicuro
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.navigate(URL_SICURO).then(c => c.focus());
                }
            }
            // Se è tutto chiuso, apriamo solo e soltanto l'URL sicuro
            if (clients.openWindow) {
                return clients.openWindow(URL_SICURO);
            }
        })
    );
});
