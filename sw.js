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

// GESTIONE BACKGROUND
messaging.onBackgroundMessage((payload) => {
  // Se Firebase gestisce già la notifica visiva, non facciamo nulla qui per evitare i doppi
  if (payload.notification) return;

  const title = payload.data?.title || "3L Creations";
  const options = {
    body: payload.data?.body || "Novità in arrivo! ✨",
    icon: 'favicon.png',
    badge: 'favicon.png',
    tag: '3l-unique-msg',
    data: { url: payload.data?.url || 'https://3lcreations.github.io/web/' }
  };
  return self.registration.showNotification(title, options);
});

// GESTIONE CLICK (IL CUORE DEL PROBLEMA)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // 1. Definiamo la base sicura
    const base = 'https://3lcreations.github.io/web/';
    let targetUrl = base;

    // 2. Cerchiamo se c'è un link specifico nei dati inviati
    const dataUrl = event.notification.data?.url || event.notification.data;
    
    if (dataUrl && typeof dataUrl === 'string' && dataUrl.includes('github.io')) {
        targetUrl = dataUrl;
    }

    // 3. CORREZIONE FORZATA: Se il link non ha /web/, lo aggiungiamo
    if (!targetUrl.includes('/web/')) {
        targetUrl = targetUrl.replace('3lcreations.github.io/', '3lcreations.github.io/web/');
    }

    // 4. Assicuriamoci che finisca con / o con l'hash
    if (!targetUrl.endsWith('/') && !targetUrl.includes('#')) {
        targetUrl += '/';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Se c'è già una finestra aperta, navighiamo quella
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if ('focus' in client) {
                    return client.navigate(targetUrl).then(c => c.focus());
                }
            }
            // Altrimenti ne apriamo una nuova
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});
