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

// === GESTIONE NOTIFICHE (Versione Intelligente Anti-Duplicato) ===
messaging.onBackgroundMessage(function(payload) {
    console.log('Notifica ricevuta in background:', payload);

    // SE C'È UNA NOTIFICA NEL PAYLOAD:
    // Firebase la mostrerà automaticamente. Se chiamiamo showNotification qui, ne escono due.
    // Quindi, se payload.notification esiste, "killiamo" questa funzione e usciamo.
    if (payload.notification) {
        console.log("Firebase mostra la notifica automaticamente. Io mi fermo.");
        return; 
    }

    // Se invece mandi solo "Dati personalizzati" (senza titolo/testo standard), la mostriamo noi:
    const notificationTitle = payload.data?.title || "3L Creations";
    const notificationOptions = {
        body: payload.data?.body || "C'è una novità per te! ✨",
        icon: 'favicon.png',
        badge: 'favicon.png',
        tag: '3l-creations-tag',
        data: {
            url: payload.data?.url || 'https://3lcreations.github.io/web/'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click sulla notifica
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Cerca l'URL nei dati (sia che arrivi da notification che da data)
    const targetUrl = event.notification.data?.url || event.notification.data || 'https://3lcreations.github.io/web/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});
