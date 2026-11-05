/* Schulkoje: offline nutzbar. Bei neuer Version CACHE hochzählen. */
const CACHE="schulkoje-v13";
const FILES=["./","./index.html","./manifest.json","./icon.svg","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.hostname.includes("generativelanguage.googleapis.com"))return;
  if(u.origin===location.origin){ // eigene Dateien: erst Netz (aktuell), sonst Cache
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){ // Schriften: Cache zuerst
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n})));
  }});
