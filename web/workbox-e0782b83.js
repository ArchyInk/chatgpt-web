define(['exports'], (t) => {
  'use strict'; try { self['workbox:core:6.5.3'] && _() }
  catch (t) {} const e = (t, ...e) => { let s = t; return e.length > 0 && (s += ` :: ${JSON.stringify(e)}`), s }; class s extends Error {constructor(t, s) { super(e(t, s)), this.name = t, this.details = s }} try { self['workbox:routing:6.5.3'] && _() }
  catch (t) {} const n = t => t && typeof t == 'object' ? t : { handle: t }; class i {constructor(t, e, s = 'GET') { this.handler = n(e), this.match = t, this.method = s }setCatchHandler(t) { this.catchHandler = n(t) }} class r extends i {
    constructor(t, e, s) {
      super(({ url: e }) => {
        const s = t.exec(e.href); if (s && (e.origin === location.origin || s.index === 0))
          return s.slice(1)
      }, e, s)
    }
  } class o {
    constructor() { this.t = new Map(), this.i = new Map() } get routes() { return this.t }addFetchListener() { self.addEventListener('fetch', (t) => { const { request: e } = t; const s = this.handleRequest({ request: e, event: t }); s && t.respondWith(s) }) }addCacheListener() { self.addEventListener('message', (t) => { if (t.data && t.data.type === 'CACHE_URLS') { const { payload: e } = t.data; const s = Promise.all(e.urlsToCache.map((e) => { typeof e == 'string' && (e = [e]); const s = new Request(...e); return this.handleRequest({ request: s, event: t }) })); t.waitUntil(s), t.ports && t.ports[0] && s.then(() => t.ports[0].postMessage(!0)) } }) }handleRequest({ request: t, event: e }) {
      const s = new URL(t.url, location.href); if (!s.protocol.startsWith('http'))
        return; const n = s.origin === location.origin; const { params: i, route: r } = this.findMatchingRoute({ event: e, request: t, sameOrigin: n, url: s }); let o = r && r.handler; const c = t.method; if (!o && this.i.has(c) && (o = this.i.get(c)), !o)
        return; let a; try { a = o.handle({ url: s, request: t, event: e, params: i }) }
      catch (t) { a = Promise.reject(t) } const h = r && r.catchHandler; return a instanceof Promise && (this.o || h) && (a = a.catch(async (n) => {
        if (h) {
          try { return await h.handle({ url: s, request: t, event: e, params: i }) }
          catch (t) { t instanceof Error && (n = t) }
        } if (this.o)
          return this.o.handle({ url: s, request: t, event: e }); throw n
      })), a
    }

    findMatchingRoute({ url: t, sameOrigin: e, request: s, event: n }) {
      const i = this.t.get(s.method) || []; for (const r of i) {
        let i; const o = r.match({ url: t, sameOrigin: e, request: s, event: n }); if (o)
          return i = o, (Array.isArray(i) && i.length === 0 || o.constructor === Object && Object.keys(o).length === 0 || typeof o == 'boolean') && (i = void 0), { route: r, params: i }
      } return {}
    }

    setDefaultHandler(t, e = 'GET') { this.i.set(e, n(t)) }setCatchHandler(t) { this.o = n(t) }registerRoute(t) { this.t.has(t.method) || this.t.set(t.method, []), this.t.get(t.method).push(t) }unregisterRoute(t) {
      if (!this.t.has(t.method))
        throw new s('unregister-route-but-not-found-with-method', { method: t.method }); const e = this.t.get(t.method).indexOf(t); if (!(e > -1))
        throw new s('unregister-route-route-not-registered'); this.t.get(t.method).splice(e, 1)
    }
  } let c; const a = () => (c || (c = new o(), c.addFetchListener(), c.addCacheListener()), c); function h(t, e, n) {
    let o; if (typeof t == 'string') { const s = new URL(t, location.href); o = new i(({ url: t }) => t.href === s.href, e, n) }
    else if (t instanceof RegExp) { o = new r(t, e, n) }
    else if (typeof t == 'function') { o = new i(t, e, n) }
    else {
      if (!(t instanceof i))
        throw new s('unsupported-route-type', { moduleName: 'workbox-routing', funcName: 'registerRoute', paramName: 'capture' }); o = t
    } return a().registerRoute(o), o
  } const u = { googleAnalytics: 'googleAnalytics', precache: 'precache-v2', prefix: 'workbox', runtime: 'runtime', suffix: typeof registration != 'undefined' ? registration.scope : '' }; const l = t => [u.prefix, t, u.suffix].filter(t => t && t.length > 0).join('-'); const f = { updateDetails: (t) => { ((t) => { for (const e of Object.keys(u))t(e) })((e) => { typeof t[e] == 'string' && (u[e] = t[e]) }) }, getGoogleAnalyticsName: t => t || l(u.googleAnalytics), getPrecacheName: t => t || l(u.precache), getPrefix: () => u.prefix, getRuntimeName: t => t || l(u.runtime), getSuffix: () => u.suffix }; function w(t, e) { const s = e(); return t.waitUntil(s), s } try { self['workbox:precaching:6.5.3'] && _() }
  catch (t) {} const d = '__WB_REVISION__'; function p(t) {
    if (!t)
      throw new s('add-to-cache-list-unexpected-type', { entry: t }); if (typeof t == 'string') { const e = new URL(t, location.href); return { cacheKey: e.href, url: e.href } } const { revision: e, url: n } = t; if (!n)
      throw new s('add-to-cache-list-unexpected-type', { entry: t }); if (!e) { const t = new URL(n, location.href); return { cacheKey: t.href, url: t.href } } const i = new URL(n, location.href); const r = new URL(n, location.href); return i.searchParams.set(d, e), { cacheKey: i.href, url: r.href }
  } class y {constructor() { this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: t, state: e }) => { e && (e.originalRequest = t) }, this.cachedResponseWillBeUsed = async ({ event: t, state: e, cachedResponse: s }) => { if (t.type === 'install' && e && e.originalRequest && e.originalRequest instanceof Request) { const t = e.originalRequest.url; s ? this.notUpdatedURLs.push(t) : this.updatedURLs.push(t) } return s } }} class g {constructor({ precacheController: t }) { this.cacheKeyWillBeUsed = async ({ request: t, params: e }) => { const s = (e == null ? void 0 : e.cacheKey) || this.h.getCacheKeyForURL(t.url); return s ? new Request(s, { headers: t.headers }) : t }, this.h = t }} let R; async function m(t, e) {
    let n = null; if (t.url) { n = new URL(t.url).origin } if (n !== self.location.origin)
      throw new s('cross-origin-copy-response', { origin: n }); const i = t.clone(); const r = { headers: new Headers(i.headers), status: i.status, statusText: i.statusText }; const o = e ? e(r) : r; const c = (function () {
      if (void 0 === R) {
        const t = new Response(''); if ('body' in t) {
          try { new Response(t.body), R = !0 }
          catch (t) { R = !1 }
        }R = !1
      } return R
    }())
      ? i.body
      : await i.blob(); return new Response(c, o)
  } function v(t, e) { const s = new URL(t); for (const t of e)s.searchParams.delete(t); return s.href } class q {constructor() { this.promise = new Promise((t, e) => { this.resolve = t, this.reject = e }) }} const U = new Set(); try { self['workbox:strategies:6.5.3'] && _() }
  catch (t) {} function b(t) { return typeof t == 'string' ? new Request(t) : t } class L {
    constructor(t, e) { this.u = {}, Object.assign(this, e), this.event = e.event, this.l = t, this.p = new q(), this.g = [], this.R = [...t.plugins], this.m = new Map(); for (const t of this.R) this.m.set(t, {}); this.event.waitUntil(this.p.promise) } async fetch(t) {
      const { event: e } = this; let n = b(t); if (n.mode === 'navigate' && e instanceof FetchEvent && e.preloadResponse) {
        const t = await e.preloadResponse; if (t)
          return t
      } const i = this.hasCallback('fetchDidFail') ? n.clone() : null; try { for (const t of this.iterateCallbacks('requestWillFetch'))n = await t({ request: n.clone(), event: e }) }
      catch (t) {
        if (t instanceof Error)
          throw new s('plugin-error-request-will-fetch', { thrownErrorMessage: t.message })
      } const r = n.clone(); try { let t; t = await fetch(n, n.mode === 'navigate' ? void 0 : this.l.fetchOptions); for (const s of this.iterateCallbacks('fetchDidSucceed'))t = await s({ event: e, request: r, response: t }); return t }
      catch (t) { throw i && await this.runCallbacks('fetchDidFail', { error: t, event: e, originalRequest: i.clone(), request: r.clone() }), t }
    }

    async fetchAndCachePut(t) { const e = await this.fetch(t); const s = e.clone(); return this.waitUntil(this.cachePut(t, s)), e } async cacheMatch(t) { const e = b(t); let s; const { cacheName: n, matchOptions: i } = this.l; const r = await this.getCacheKey(e, 'read'); const o = Object.assign(Object.assign({}, i), { cacheName: n }); s = await caches.match(r, o); for (const t of this.iterateCallbacks('cachedResponseWillBeUsed'))s = await t({ cacheName: n, matchOptions: i, cachedResponse: s, request: r, event: this.event }) || void 0; return s } async cachePut(t, e) {
      const n = b(t); let i; await (i = 0, new Promise(t => setTimeout(t, i))); const r = await this.getCacheKey(n, 'write'); if (!e)
        throw new s('cache-put-with-no-response', { url: (o = r.url, new URL(String(o), location.href).href.replace(new RegExp(`^${location.origin}`), '')) }); let o; const c = await this.v(e); if (!c)
        return !1; const { cacheName: a, matchOptions: h } = this.l; const u = await self.caches.open(a); const l = this.hasCallback('cacheDidUpdate'); const f = l
        ? await (async function (t, e, s, n) {
          const i = v(e.url, s); if (e.url === i)
            return t.match(e, n); const r = Object.assign(Object.assign({}, n), { ignoreSearch: !0 }); const o = await t.keys(e, r); for (const e of o) {
            if (i === v(e.url, s))
              return t.match(e, n)
          }
        }(u, r.clone(), ['__WB_REVISION__'], h))
        : null; try { await u.put(r, l ? c.clone() : c) }
      catch (t) {
        if (t instanceof Error)
          throw t.name === 'QuotaExceededError' && await (async function () { for (const t of U) await t() }()), t
      } for (const t of this.iterateCallbacks('cacheDidUpdate')) await t({ cacheName: a, oldResponse: f, newResponse: c.clone(), request: r, event: this.event }); return !0
    }

    async getCacheKey(t, e) { const s = `${t.url} | ${e}`; if (!this.u[s]) { let n = t; for (const t of this.iterateCallbacks('cacheKeyWillBeUsed'))n = b(await t({ mode: e, request: n, event: this.event, params: this.params })); this.u[s] = n } return this.u[s] }hasCallback(t) {
      for (const e of this.l.plugins) {
        if (t in e)
          return !0
      } return !1
    }

    async runCallbacks(t, e) { for (const s of this.iterateCallbacks(t)) await s(e) }*iterateCallbacks(t) { for (const e of this.l.plugins) if (typeof e[t] == 'function') { const s = this.m.get(e); const n = (n) => { const i = Object.assign(Object.assign({}, n), { state: s }); return e[t](i) }; yield n } }waitUntil(t) { return this.g.push(t), t } async doneWaiting() { let t; for (;t = this.g.shift();) await t }destroy() { this.p.resolve(null) } async v(t) {
      let e = t; let s = !1; for (const t of this.iterateCallbacks('cacheWillUpdate')) {
        if (e = await t({ request: this.request, response: e, event: this.event }) || void 0, s = !0, !e)
          break
      } return s || e && e.status !== 200 && (e = void 0), e
    }
  } class x {
    constructor(t = {}) { this.cacheName = f.getRuntimeName(t.cacheName), this.plugins = t.plugins || [], this.fetchOptions = t.fetchOptions, this.matchOptions = t.matchOptions }handle(t) { const [e] = this.handleAll(t); return e }handleAll(t) { t instanceof FetchEvent && (t = { event: t, request: t.request }); const e = t.event; const s = typeof t.request == 'string' ? new Request(t.request) : t.request; const n = 'params' in t ? t.params : void 0; const i = new L(this, { event: e, request: s, params: n }); const r = this.q(i, s, e); return [r, this.U(r, i, s, e)] } async q(t, e, n) {
      let i; await t.runCallbacks('handlerWillStart', { event: n, request: e }); try {
        if (i = await this.L(e, t), !i || i.type === 'error')
          throw new s('no-response', { url: e.url })
      }
      catch (s) {
        if (s instanceof Error) {
          for (const r of t.iterateCallbacks('handlerDidError')) {
            if (i = await r({ error: s, event: n, request: e }), i)
              break
          }
        } if (!i)
          throw s
      } for (const s of t.iterateCallbacks('handlerWillRespond'))i = await s({ event: n, request: e, response: i }); return i
    }

    async U(t, e, s, n) {
      let i, r; try { i = await t }
      catch (r) {} try { await e.runCallbacks('handlerDidRespond', { event: n, request: s, response: i }), await e.doneWaiting() }
      catch (t) { t instanceof Error && (r = t) } if (await e.runCallbacks('handlerDidComplete', { event: n, request: s, response: i, error: r }), e.destroy(), r)
        throw r
    }
  } class C extends x {
    constructor(t = {}) { t.cacheName = f.getPrecacheName(t.cacheName), super(t), this._ = !1 !== t.fallbackToNetwork, this.plugins.push(C.copyRedirectedCacheableResponsesPlugin) } async L(t, e) { const s = await e.cacheMatch(t); return s || (e.event && e.event.type === 'install' ? await this.C(t, e) : await this.N(t, e)) } async N(t, e) {
      let n; const i = e.params || {}; if (!this._)
        throw new s('missing-precache-entry', { cacheName: this.cacheName, url: t.url }); { const s = i.integrity; const r = t.integrity; const o = !r || r === s; n = await e.fetch(new Request(t, { integrity: t.mode !== 'no-cors' ? r || s : void 0 })), s && o && t.mode !== 'no-cors' && (this.O(), await e.cachePut(t, n.clone())) } return n
    }

    async C(t, e) {
      this.O(); const n = await e.fetch(t); if (!await e.cachePut(t, n.clone()))
        throw new s('bad-precaching-response', { url: t.url, status: n.status }); return n
    }

    O() { let t = null; let e = 0; for (const [s, n] of this.plugins.entries())n !== C.copyRedirectedCacheableResponsesPlugin && (n === C.defaultPrecacheCacheabilityPlugin && (t = s), n.cacheWillUpdate && e++); e === 0 ? this.plugins.push(C.defaultPrecacheCacheabilityPlugin) : e > 1 && t !== null && this.plugins.splice(t, 1) }
  }C.defaultPrecacheCacheabilityPlugin = { cacheWillUpdate: async ({ response: t }) => !t || t.status >= 400 ? null : t }, C.copyRedirectedCacheableResponsesPlugin = { cacheWillUpdate: async ({ response: t }) => t.redirected ? await m(t) : t }; class E {
    constructor({ cacheName: t, plugins: e = [], fallbackToNetwork: s = !0 } = {}) { this.P = new Map(), this.j = new Map(), this.k = new Map(), this.l = new C({ cacheName: f.getPrecacheName(t), plugins: [...e, new g({ precacheController: this })], fallbackToNetwork: s }), this.install = this.install.bind(this), this.activate = this.activate.bind(this) } get strategy() { return this.l }precache(t) { this.addToCacheList(t), this.K || (self.addEventListener('install', this.install), self.addEventListener('activate', this.activate), this.K = !0) }addToCacheList(t) {
      const e = []; for (const n of t) {
        typeof n == 'string' ? e.push(n) : n && void 0 === n.revision && e.push(n.url); const { cacheKey: t, url: i } = p(n); const r = typeof n != 'string' && n.revision ? 'reload' : 'default'; if (this.P.has(i) && this.P.get(i) !== t)
          throw new s('add-to-cache-list-conflicting-entries', { firstEntry: this.P.get(i), secondEntry: t }); if (typeof n != 'string' && n.integrity) {
          if (this.k.has(t) && this.k.get(t) !== n.integrity)
            throw new s('add-to-cache-list-conflicting-integrities', { url: i }); this.k.set(t, n.integrity)
        } if (this.P.set(i, t), this.j.set(i, r), e.length > 0) { const t = `Workbox is precaching URLs without revision info: ${e.join(', ')}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`; console.warn(t) }
      }
    }

    install(t) { return w(t, async () => { const e = new y(); this.strategy.plugins.push(e); for (const [e, s] of this.P) { const n = this.k.get(s); const i = this.j.get(e); const r = new Request(e, { integrity: n, cache: i, credentials: 'same-origin' }); await Promise.all(this.strategy.handleAll({ params: { cacheKey: s }, request: r, event: t })) } const { updatedURLs: s, notUpdatedURLs: n } = e; return { updatedURLs: s, notUpdatedURLs: n } }) }activate(t) { return w(t, async () => { const t = await self.caches.open(this.strategy.cacheName); const e = await t.keys(); const s = new Set(this.P.values()); const n = []; for (const i of e)s.has(i.url) || (await t.delete(i), n.push(i.url)); return { deletedURLs: n } }) }getURLsToCacheKeys() { return this.P }getCachedURLs() { return [...this.P.keys()] }getCacheKeyForURL(t) { const e = new URL(t, location.href); return this.P.get(e.href) }getIntegrityForCacheKey(t) { return this.k.get(t) } async matchPrecache(t) { const e = t instanceof Request ? t.url : t; const s = this.getCacheKeyForURL(e); if (s) { return (await self.caches.open(this.strategy.cacheName)).match(s) } }createHandlerBoundToURL(t) {
      const e = this.getCacheKeyForURL(t); if (!e)
        throw new s('non-precached-url', { url: t }); return s => (s.request = new Request(t), s.params = Object.assign({ cacheKey: e }, s.params), this.strategy.handle(s))
    }
  } let N; const O = () => (N || (N = new E()), N); class P extends i {constructor(t, e) { super(({ request: s }) => { const n = t.getURLsToCacheKeys(); for (const i of (function*(t, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: s = 'index.html', cleanURLs: n = !0, urlManipulation: i } = {}) { const r = new URL(t, location.href); r.hash = '', yield r.href; const o = (function (t, e = []) { for (const s of [...t.searchParams.keys()])e.some(t => t.test(s)) && t.searchParams.delete(s); return t }(r, e)); if (yield o.href, s && o.pathname.endsWith('/')) { const t = new URL(o.href); t.pathname += s, yield t.href } if (n) { const t = new URL(o.href); t.pathname += '.html', yield t.href } if (i) { const t = i({ url: r }); for (const e of t) yield e.href } }(s.url, e))) { const e = n.get(i); if (e) { return { cacheKey: e, integrity: t.getIntegrityForCacheKey(e) } } } }, t.strategy) }} const j = async (t, e = '-precache-') => { const s = (await self.caches.keys()).filter(s => s.includes(e) && s.includes(self.registration.scope) && s !== t); return await Promise.all(s.map(t => self.caches.delete(t))), s }; t.NavigationRoute = class extends i {
    constructor(t, { allowlist: e = [/./], denylist: s = [] } = {}) { super(t => this.S(t), t), this.T = e, this.W = s }S({ url: t, request: e }) {
      if (e && e.mode !== 'navigate')
        return !1; const s = t.pathname + t.search; for (const t of this.W) {
        if (t.test(s))
          return !1
      } return !!this.T.some(t => t.test(s))
    }
  }, t.cleanupOutdatedCaches = function () { self.addEventListener('activate', (t) => { const e = f.getPrecacheName(); t.waitUntil(j(e).then((t) => {})) }) }, t.createHandlerBoundToURL = function (t) { return O().createHandlerBoundToURL(t) }, t.precacheAndRoute = function (t, e) { !(function (t) { O().precache(t) }(t)), (function (t) { const e = O(); h(new P(e, t)) }(e)) }, t.registerRoute = h
})
