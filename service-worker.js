const VERSION = "gym-tracker-v2";
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./icons/apple-touch-icon.svg",
  "./assets/offline-exercise.svg",
  "./assets/exercises/abdomen-vacuum.svg",
  "./assets/exercises/curl-biceps.png",
  "./assets/exercises/curl-femoral.png",
  "./assets/exercises/curl-martillo.png",
  "./assets/exercises/elevaciones-laterales.png",
  "./assets/exercises/elevaciones-piernas.png",
  "./assets/exercises/face-pull.png",
  "./assets/exercises/gemelos.png",
  "./assets/exercises/hip-thrust.png",
  "./assets/exercises/jalon-pecho-amplio.png",
  "./assets/exercises/jalon-pecho.png",
  "./assets/exercises/peso-muerto-rumano.png",
  "./assets/exercises/plancha.png",
  "./assets/exercises/prensa.png",
  "./assets/exercises/press-banca-plano.png",
  "./assets/exercises/press-hombro.png",
  "./assets/exercises/press-inclinado-barra.png",
  "./assets/exercises/remo-con-barra.png",
  "./assets/exercises/remo-maquina.png",
  "./assets/exercises/sentadilla.png",
  "./assets/exercises/triceps-cuerda.png",
  "./assets/exercises/zancadas.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.hostname.includes("script.google.com") || url.hostname.includes("script.googleusercontent.com")) {
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  if (request.destination === "style" || request.destination === "font") {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function handleNavigationRequest(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, fresh.clone());
    cache.put("./index.html", fresh.clone());
    return fresh;
  } catch (error) {
    return caches.match(request) || caches.match("./index.html");
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  return networkResponse || Response.error();
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request, { mode: "no-cors" });
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match("./assets/offline-exercise.svg");
  }
}
