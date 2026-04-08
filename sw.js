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

messaging.onBackgroundMessage(function(payload) {
    if (payload.notification) return; // Evita i duplicati se Firebase fa già da solo
    
    const options = {
        body: payload.data?.body || "Scopri le novità! ✨",
        icon: 'favicon.png',
        badge: 'favicon.png',
        data: { url: 'https://3lcreations.github.io/web/' }
    };
    return self.registration.showNotification(payload.data?.title || "3L Creations", options);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // 1. URL DI BASE
    let targetUrl = 'https://3lcreations.github.io/web/';

    // 2. CERCA L'URL NELLE IMPOSTAZIONI DELLA NOTIFICA
    if (event.notification.data) {
        if (event.notification.data.url) {
            targetUrl = event.notification.data.url;
        } else if (event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification && event.notification.data.FCM_MSG.notification.click_action) {
            targetUrl = event.notification.data.FCM_MSG.notification.click_action;
        }
    }

    // 3. LO SCUDO ANTI-RADICE (Il controllo finale)
    // Se targetUrl è ESATTAMENTE "https://3lcreations.github.io" (con o senza slash) lo riscrive
    if (targetUrl === 'https://3lcreations.github.io' || targetUrl === 'https://3lcreations.github.io/') {
        targetUrl = 'https://3lcreations.github.io/web/';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.navigate(targetUrl).then(c => c.focus());
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
