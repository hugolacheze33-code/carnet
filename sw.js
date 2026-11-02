// Ouverture immédiate depuis le cache, même avec un mauvais réseau ; la mise à jour arrive en arrière-plan pour l'ouverture suivante
const V = 'carnet-mvzao91a';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') {
    const net = fetch(r.url, { cache: 'no-store' }).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put('index.html', cp)); } return res; });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(caches.match('index.html').then(m => m || net));
    return;
  }
  if (u.origin === location.origin || /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
  }
});
