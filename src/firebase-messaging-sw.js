importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // apiKey: "AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg",
  // authDomain: "pockit-df54e.firebaseapp.com",
  // projectId: "pockit-df54e",
  // storageBucket: "pockit-df54e.firebasestorage.app",
  // messagingSenderId: "658839127239",
  // appId: "1:658839127239:web:9d5101fb9718275b116ae2",
  // measurementId: "G-N76JL181BX",

  apiKey: "AIzaSyBHNvnQFnEV4oLDQREF1nXNbllOV-5STKY",
  authDomain: "pockit-engineers.firebaseapp.com",
  projectId: "pockit-engineers",
  storageBucket: "pockit-engineers.firebasestorage.app",
  messagingSenderId: "427204155934",
  appId: "1:427204155934:web:e9576c9de50b2aa2f5ac0f",
  measurementId: "G-ZKJWKWPMB9"
});

const messaging = firebase.messaging();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("firebase-messaging-sw.js")
    .then(function (registration) {})
    .catch(function (err) {
      
    });
}

messaging.onBackgroundMessage((payload) => {
  self.clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage(payload);
      });
    });
});



messaging.onBackgroundMessage((payload) => {
  self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage(payload);
    });
  });
});

self.addEventListener("push", (event) => {
  const payload = event.data.json();
  const data = payload.notification || {};
  const title = data.title || "No title";

  event.waitUntil(
    Promise.all([
      // Show notification always
      self.registration.showNotification(title, {
        body: data.body,
        icon: data.icon || "./assets/img/Logo111.png",
        tag: "PockIT",
      }),

      // Send message to all open windows
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ notification: data });
        });
      }),
    ])
  );
});



