const CACHE_NAME = 'gunluk-sorular-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/icon.png'
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// Handle notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        // Schedule notification logic would go here
        console.log('Notification scheduled for:', event.data.time);
    }
});
