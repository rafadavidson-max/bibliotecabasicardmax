const CACHE = 'biblioteca-basica-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(chaves.filter(c => c !== CACHE).map(c => caches.delete(c)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(resposta => {
      if (resposta) return resposta;
      return fetch(e.request).then(rede => {
        const copia = rede.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copia));
        return rede;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
