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