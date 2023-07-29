"use strict"

const endpoint="/users"

async function handleRequest(request, event) {
    try {
      const fetchResponse = await fetch(request);
  
      // Clone the response to read the body and log it
      const clonedResponse = fetchResponse.clone();
      const responseBody = await clonedResponse.text();
      console.log('Response Body:', responseBody);
  
      // Cache the original response
      const responseClone = fetchResponse.clone();
      event.waitUntil(
        caches.open('your-cache-name')
          .then(cache => cache.put(request, responseClone))
      );
  
      return fetchResponse;
    } catch (error) {
      console.error('Error fetching:', error);
      return new Response('Error fetching data', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
  }


self.addEventListener('fetch', event => {
    if(!(event.request.url.includes(endpoint))) {
        return
    }
    event.respondWith(handleRequest(event.request, event)); 
  });