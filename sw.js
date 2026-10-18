
const C='invernadero-v9';

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll([
    './',
    './index.html',
    './manifest.json',
    './icon.svg'
  ])));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys.filter(k=>k.startsWith('invernadero-')&&k!==C)
        .map(k=>caches.delete(k))
      )
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok && new URL(e.request.url).origin===self.location.origin){
        const copy=r.clone();
        caches.open(C).then(c=>c.put(e.request,copy));
      }
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
