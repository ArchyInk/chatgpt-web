if (!self.define) {
  let e; const s = {}; const i = (i, n) => (i = new URL(`${i}.js`, n).href, s[i] || new Promise((s) => {
    if ('document' in self) { const e = document.createElement('script'); e.src = i, e.onload = s, document.head.appendChild(e) }
    else { e = i, importScripts(i), s() }
  }).then(() => {
    const e = s[i]; if (!e)
      throw new Error(`Module ${i} didn’t register its module`); return e
  })); self.define = (n, r) => {
    const l = e || ('document' in self ? document.currentScript.src : '') || location.href; if (s[l])
      return; const t = {}; const o = e => i(e, l); const d = { module: { uri: l }, exports: t, require: o }; s[l] = Promise.all(n.map(e => d[e] || o(e))).then(e => (r(...e), t))
  }
}define(['./workbox-e0782b83'], (e) => { 'use strict'; self.addEventListener('message', (e) => { e.data && e.data.type === 'SKIP_WAITING' && self.skipWaiting() }), e.precacheAndRoute([{ url: 'assets/index-13a4a04d.js', revision: null }, { url: 'assets/index-3c6da4d6.js', revision: null }, { url: 'assets/index-667c9a00.css', revision: null }, { url: 'assets/index-a6c9935d.css', revision: null }, { url: 'assets/index-e074a613.js', revision: null }, { url: 'assets/index-ee3d92db.js', revision: null }, { url: 'index.html', revision: '338845c4562192bf1a1290099e510ff6' }, { url: 'registerSW.js', revision: '1872c500de691dce40960bb85481de07' }, { url: 'pwa-192x192.png', revision: 'e8edb535529201a3b8a82f2fe3b07b09' }, { url: 'pwa-512x512.png', revision: '2a5ea0072f596f4b1006b3943aac2a9e' }, { url: 'manifest.webmanifest', revision: '8a6b785bac1ef66f075d8ad3d022e306' }], {}), e.cleanupOutdatedCaches(), e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL('index.html'))) })
