const C='rhs-v1',P=['./','index.html','addon.js','manifest.json','icon-192.png','icon-512.png',
'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js','https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js','https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(P.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!='GET')return;
 const own=u.origin==location.origin,cdn=/^(www\.gstatic\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)$/.test(u.hostname);
 if(!own&&!cdn)return;
 const put=x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x};
 e.respondWith(own
  ?fetch(r).then(put).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')))
  :caches.match(r).then(m=>m||fetch(r).then(put)));
});
