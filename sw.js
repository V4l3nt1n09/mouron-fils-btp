// Service Worker — MOURON & FILS
// Stratégie "réseau d'abord" : toujours la dernière version en ligne,
// le cache ne sert que de secours hors-ligne.

const CACHE_NAME = 'mouron-fils-v1';
const FICHIERS_DE_BASE = [
  './',
  './index.html',
  './manifest.json',
  './logo-mouron-fils.png'
];

// Installation : on met en cache les fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FICHIERS_DE_BASE))
  );
  self.skipWaiting();
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(
        cles.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))
      )
    )
  );
  self.clients.claim();
});

// Requêtes : réseau d'abord, cache en secours
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
