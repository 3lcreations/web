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
