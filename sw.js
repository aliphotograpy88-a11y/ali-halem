// يخلي الموقع يتثبت على الفون وينفتح بسرعة حتى لو النت ضعيف
var CACHE = 'ah-v1';
var FILES = ['./', './index.html', './manifest.webmanifest', './assets/gear.jpg', './assets/gear-bg.jpg', './assets/ali.jpg', './assets/icon-192.png', './assets/icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // الصفحة: من النت أولاً حتى التحديثات توصل، والكاش احتياط
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(CACHE).then(function (x) { x.put('./index.html', c); }); return r; }).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
});
