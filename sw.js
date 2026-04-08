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

// === COSA SUCCEDE AL CLICK SULLA NOTIFICA (Versione Corazzata) ===
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Chiude il fumetto

    // IL RADAR DEI LINK: Cerca l'URL in 3 posti diversi
    // 1. Nei dati personalizzati 'url'
    // 2. Nel campo standard di Firebase 'click_action'
    // 3. Se non trova nulla, usa il link sicuro di 3L Creations con /web/
    let targetUrl = 'https://3lcreations.github.io/web/';

    if (event.notification.data) {
        // Cerca nel campo 'url' che mettiamo noi
        if (event.notification.data.url) {
            targetUrl = event.notification.data.url;
        } 
        // Cerca nel campo segreto di Firebase (FCM_MSG)
        else if (event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification && event.notification.data.FCM_MSG.notification.click_action) {
            targetUrl = event.notification.data.FCM_MSG.notification.click_action;
        }
    }

    // Assicuriamoci che l'URL sia completo (se per caso arrivasse un link relativo)
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://3lcreations.github.io/web/' + (targetUrl.startsWith('/') ? targetUrl.substring(1) : targetUrl);
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se il sito è già aperto in una scheda, carichiamo l'URL lì e mettiamola in primo piano
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.navigate(targetUrl).then(c => c.focus());
                }
            }
            // Se il sito è chiuso, apri una nuova finestra
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
