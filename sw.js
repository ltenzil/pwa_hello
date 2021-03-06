var cacheName = 'hello-pwa-v1';
var filesToCache = [
  './offline.html'
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
      if (navigator.onLine == true) {
        return fetch(e.request);
      } else {
        return caches.match('/offline.html');
      }
	 //  if (navigate.onLine == false) {
		// return response || caches.match('/offline.html');
	 //  }else {
  //       return response || fetch(e.request);
  //     }
      // return fetch(e.request).then(function(response) {
      //   // if (response.status === 404) {
      //   //   return caches.match('/404.html');
      //   // }
      //   return response
      // });
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline.html');
      // However, in reality you'd have many different
      // fallbacks, depending on URL & headers.
      // Eg, a fallback silhouette image for avatars.
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


// startSpinner = function() {
//   spinner = '<div id="spinner" class="text-center"><img src="images/spinner.gif" alt="loading" /></div>'
//   window.document.getElementsByTagName('body')[0].innerHTML = spinner;
// };

// stopSpinner = function() {
//   window.document.getElementById('spinner').remove();
// }

// updatePage = function(data) {
// 	window.document.getElementsByTagName('body')[0].innerHTML = data
// } 

// var networkDataReceived = false;

// startSpinner();

// // fetch fresh data
// var networkUpdate = fetch('/offline.html').then(function(response) {
//   return response.json();
// }).then(function(data) {
//   networkDataReceived = true;
//   updatePage(data);
// });

// // fetch cached data
// caches.match('/offline.html').then(function(response) {
//   if (!response) throw Error("No data");
//   return response;
// }).then(function(data) {
//   // don't overwrite newer network data
//   if (!networkDataReceived) {
//     updatePage(data);
//   }
// }).catch(function() {
//   // we didn't get cached data, the network is our last hope:
//   return networkUpdate;
// }).catch(showErrorMessage).then(stopSpinner());



