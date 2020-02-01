var cacheName = 'hello-pwa';
var filesToCache = [
  './',
  './offline.html',
  './css/style.css',
  './js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});


startSpinner = function() {
  spinner = '<div id="spinner" class="text-center"><img src="images/spinner.gif" alt="loading" /></div>'
  document.getElementsByTagName('body')[0].innerHTML = spinner;
};

stopSpinner = function() {
  document.getElementById('spinner').remove();
}

updatePage = function(data) {
	document.getElementsByTagName('body')[0].innerHTML = data
} 

var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/offline.html').then(function(response) {
  return response.json();
}).then(function(data) {
  networkDataReceived = true;
  updatePage(data);
});

// fetch cached data
caches.match('/offline.html').then(function(response) {
  if (!response) throw Error("No data");
  return response;
}).then(function(data) {
  // don't overwrite newer network data
  if (!networkDataReceived) {
    updatePage(data);
  }
}).catch(function() {
  // we didn't get cached data, the network is our last hope:
  return networkUpdate;
}).catch(showErrorMessage).then(stopSpinner());



