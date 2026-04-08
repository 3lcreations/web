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

    // 1. Definiamo l'unico posto dove deve andare l'app
    const BASE_URL = 'https://3lcreations.github.io/web/';
    
    // 2. Cerchiamo di capire dove voleva mandarci Firebase
    let linkDaAprire = event.notification.data?.url || 
                       event.notification.data?.FCM_MSG?.notification?.click_action || 
                       BASE_URL;

    // 3. IL FILTRO DI SICUREZZA:
    // Se il link non contiene "/web/", lo forziamo noi aggiungendolo.
    // Trasformiamo "https://3lcreations.github.io/" in "https://3lcreations.github.io/web/"
    if (typeof linkDaAprire === 'string' && !linkDaAprire.includes('/web/')) {
        // Rimuoviamo la parte finale se c'è solo la slash e aggiungiamo /web/
        let pulito = linkDaAprire.endsWith('/') ? linkDaAprire.slice(0, -1) : linkDaAprire;
        linkDaAprire = pulito + '/web/';
    }

    console.log("Forzo l'apertura su:", linkDaAprire);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se c'è una finestra già aperta del sito, usiamo quella
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.navigate(linkDaAprire).then(c => c.focus());
                }
            }
            // Altrimenti ne apriamo una nuova di zecca con il link corretto
            if (clients.openWindow) {
                return clients.openWindow(linkDaAprire);
            }
        })
    );
});
