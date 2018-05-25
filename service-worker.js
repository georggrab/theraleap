/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/0.bundle.js","640710981ca0232a8422d840287251ad"],["/0222fe91d197d82b66e1.worker.js","741b485516de3994c05c100c6ffd2bc7"],["/02ce2e901f7e6a9190ce.worker.js","bdcbeb3f369e0deffc80248fa3e50607"],["/1.bundle.js","537973ba77510fddf9352f1b351b656d"],["/10.bundle.js","ccb480a38e77047bdae9a4ccf5c8c91d"],["/11.bundle.js","a4e4d3e17572c4be7e4f60a10c6d7f77"],["/12.bundle.js","b192c1b8b63ab17a5fa3494b245e7cb3"],["/13.bundle.js","88da3b9bccdd159b7e33c0eab33e39c6"],["/14.bundle.js","4ca49289db6b75b4905ecbe5769975dd"],["/15.bundle.js","849b761a8a14f3e1ed1fb79c836aeefa"],["/16.bundle.js","757f5fc4384e762372bac5a943f79d45"],["/17.bundle.js","c6c35a6c5826b660a9ab894ba0567e3b"],["/18.bundle.js","1e6d0bf2de6c9072618da8dadb17d539"],["/19.bundle.js","fa9da12213557a275f3c890153c19bff"],["/2.bundle.js","c798734ebc8c400b0075dd0a985872a7"],["/20.bundle.js","c131375aad47a0f03c284a8a5db32c8c"],["/21.bundle.js","9b3c37a420f47de616f405c3701e9c93"],["/22.bundle.js","a49b84d1aaaf9f6c761987ba6f9331bb"],["/23.bundle.js","876e7d27a3347b0a6b8093f3a465da61"],["/24.bundle.js","f8354262affc848a4531a53033094744"],["/25.bundle.js","556415b48edf64e09db63b8ceb011d4f"],["/26.bundle.js","73b5811e83e18e08a39b5ba86ee7c503"],["/27.bundle.js","18f17e5de6c354c7a6987c6bd808fe2a"],["/27f1c2498ccf278e4813.worker.js","99bdd5b3fb6c28f06795f0aa11e2975e"],["/3.bundle.js","742a3281550aee9e28ad39b3e51abe73"],["/4.bundle.js","7909d8ec52b7862f22ce28f7035bd75e"],["/4609f922d1ac2fed8e00.worker.js","62973b2ea7af80044e7077dcbddd25af"],["/5.bundle.js","9cc47b3c39098a6a8f4bb591306005f3"],["/6.bundle.js","ed854381040b0d4e26bf49e55a751d2d"],["/7.bundle.js","4166d75ce5fcdd3d47c9ec0327625eb2"],["/8.bundle.js","a5851d80058ea8e457b66bc9c8eafc60"],["/9.bundle.js","ef1783d03df02b62a30cd4e3173699d4"],["/99430e46c411795474d9.worker.js","56a3af51e975f06f64ec325b12958beb"],["/a00d73828d26740314a4.worker.js","785d2149c67be2cd8f99361ad26d8fdf"],["/bundle.js","e9290d0d5676dafc2d21ac9ac52fd7dc"],["/c22b6733c2a2e81247df.worker.js","95478bc217df51a425bcc3abaf8cbce2"],["/index.html","3ae639c95eef2a3bfc7f14b1d07d9bef"],["/service-worker.js","fd00bbae8fb3d837f543bc2e279c595e"],["/theraleap/0.bundle.js","640710981ca0232a8422d840287251ad"],["/theraleap/1.bundle.js","537973ba77510fddf9352f1b351b656d"],["/theraleap/10.bundle.js","ccb480a38e77047bdae9a4ccf5c8c91d"],["/theraleap/11.bundle.js","a4e4d3e17572c4be7e4f60a10c6d7f77"],["/theraleap/12.bundle.js","b192c1b8b63ab17a5fa3494b245e7cb3"],["/theraleap/13.bundle.js","88da3b9bccdd159b7e33c0eab33e39c6"],["/theraleap/14.bundle.js","4ca49289db6b75b4905ecbe5769975dd"],["/theraleap/15.bundle.js","849b761a8a14f3e1ed1fb79c836aeefa"],["/theraleap/16.bundle.js","757f5fc4384e762372bac5a943f79d45"],["/theraleap/17.bundle.js","c6c35a6c5826b660a9ab894ba0567e3b"],["/theraleap/18.bundle.js","1e6d0bf2de6c9072618da8dadb17d539"],["/theraleap/19.bundle.js","fa9da12213557a275f3c890153c19bff"],["/theraleap/2.bundle.js","c798734ebc8c400b0075dd0a985872a7"],["/theraleap/20.bundle.js","c131375aad47a0f03c284a8a5db32c8c"],["/theraleap/21.bundle.js","9b3c37a420f47de616f405c3701e9c93"],["/theraleap/22.bundle.js","a49b84d1aaaf9f6c761987ba6f9331bb"],["/theraleap/23.bundle.js","876e7d27a3347b0a6b8093f3a465da61"],["/theraleap/24.bundle.js","f8354262affc848a4531a53033094744"],["/theraleap/25.bundle.js","556415b48edf64e09db63b8ceb011d4f"],["/theraleap/26.bundle.js","73b5811e83e18e08a39b5ba86ee7c503"],["/theraleap/3.bundle.js","742a3281550aee9e28ad39b3e51abe73"],["/theraleap/4.bundle.js","7909d8ec52b7862f22ce28f7035bd75e"],["/theraleap/5.bundle.js","9cc47b3c39098a6a8f4bb591306005f3"],["/theraleap/6.bundle.js","ed854381040b0d4e26bf49e55a751d2d"],["/theraleap/7.bundle.js","4166d75ce5fcdd3d47c9ec0327625eb2"],["/theraleap/8.bundle.js","a5851d80058ea8e457b66bc9c8eafc60"],["/theraleap/9.bundle.js","ef1783d03df02b62a30cd4e3173699d4"],["/theraleap/99430e46c411795474d9.worker.js","56a3af51e975f06f64ec325b12958beb"],["/theraleap/bundle.js","e9290d0d5676dafc2d21ac9ac52fd7dc"]];
var cacheName = 'sw-precache-v3-theraleap-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







