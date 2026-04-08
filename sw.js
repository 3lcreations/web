// === IMPORTAZIONI FIREBASE ===
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

// === GESTIONE NOTIFICHE IN BACKGROUND ===
messaging.onBackgroundMessage(function(payload) {
  console.log('Notifica ricevuta:', payload);

  // Se i campi sono vuoti, usiamo testi di default (evita l'undefined)
  const notificationTitle = payload.notification?.title || "3L Creations";
  const notificationOptions = {
    body: payload.notification?.body || "C'è una novità per te e il tuo pelosetto! ✨",
    icon: 'favicon.png',
    badge: 'favicon.png',
    vibrate: [200, 100, 200],
    data: {
      // Se non specifichi un link su Firebase, manderà alla Home
      url: payload.data?.url || 'https://3lcreations.github.io/web/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// === COSA SUCCEDE AL CLICK SULLA NOTIFICA ===
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Chiude il fumetto della notifica

    // Recuperiamo l'URL salvato (o usiamo la home come fallback)
    const targetUrl = event.notification.data?.url || 'https://3lcreations.github.io/web/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se l'app è già aperta in una scheda, mettila in primo piano (focus)
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se l'app è chiusa, aprila
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
