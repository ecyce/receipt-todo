// 한 번 열어두면 인터넷 없이도 열리게 캐시해둠. 페이지 고치면 VERSION 숫자 올리기
const VERSION = 'todo-v4';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './Galmuri11.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 인터넷 되면 새 버전, 안 되면 저장해둔 걸로
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
