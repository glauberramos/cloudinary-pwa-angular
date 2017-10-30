Progressive Web Apps (PWA) are a easy way to improve your application's user experience and to make regular web apps function the same as any native app. Because of that, adapting your app to become a PWA has become very important nowadays. For more information about what is a PWA you can check [Google's site](https://developers.google.com/web/progressive-web-apps/).

We are going to explain the most important steps to transform your app into a PWA, for that we built a simple app that you can check the code on [Code Pen](https://codepen.io/glauberramos/project/editor/DnaLdk) and see the live version as well [here](https://2a75b8d4c4844eb29f3e33f1a9ade1dd.codepen.website/), we built it using [Angular](https://angular.io/), [Workbox](https://workboxjs.org/) and [Cloudinary](https://cloudinary.com/).

![pwa app](http://res.cloudinary.com/dc3dnmmpx/image/upload/v1507607032/pwaapp.png "PWA App")

# Angular CLI

ng new angular-pwa
ng serve to check the project

# Workbox CLI

npm install --save-dev workbox-cli

"build": "ng build && workbox-cli generate:sw"

workbox-cli-config.js
module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{ico,html,js,map}"
  ],
  "swDest": "dist/sw.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ]
};


# Manifest.json

Adding a `manifest.json` is essential if you want your app to look like a native app. It will make your app have a splash screen, be able to be installed on a device home-screen and also hide the native URL bar from the browser.

```
{
  "name": "Cloudinary PWA Angular",
  "short_name": "Cloudinary PWA",
  "lang": "en-US",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0e2f5a",
  "background_color": "#0e2f5a",
  "icons": [
    {
      "src": "cloudinary.png",
      "sizes": "1000x1000",
      "type": "image/png"
    }
  ]
}
```

<!--<script src="https://gist.github.com/glauberramos/e01c4423b6274c9b19ebf6e4af2c2eac.js"></script>-->

# Cloudinary service

Cloudinary is a web service that provides services for managing media. We will use it to store our application images and use [@cloudinary/angular-4.x](https://github.com/cloudinary/cloudinary_angular) library in our angular component.

In order to use Cloudinary Library for Angular you need to install it and import in your main angular module:

`import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-4.x';`

Also you need to initalize the library in your main Angular file inside your `imports` section. You need to update `cloud_name` to add your Cloudinary user.

```
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dc3dnmmpx' } as CloudinaryConfiguration)
  ],

  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: []
})
```

<!--<script src="https://gist.github.com/glauberramos/c4ea93f96c9195bded87436187101d1c.js"></script>-->

After that you can add an image to your app using the following code. The `public-id` tag is the image identifier that you created on your Cloudinary account.

`<cl-image public-id="google" class="thumbnail inline" format="jpg"></cl-image>`

# WorkboxJS

[Workbox](https://workboxjs.org/) is a collection of libraries and tools that provide an easy way to create service workers and store files into user's devices, so your application can work offline.

# Register your Service Worker

You need to register your service worked first in order to use it.  

```
<script>
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('./sw.js')
      .catch(function(err) {
        console.error('Unable to register service worker.', err);
      });
    }
</script>

```

<!--<script src="https://gist.github.com/glauberramos/7ad1f148663065cee87c16090c7108ca.js"></script>-->

# Cache application shell

The first thing you need to do to make your app work offline is to cache your application shell in your `sw.js` file. A application shell is the main files of your app (HTML, CSS and JS). You can easily do that using Workbox method called `precache `. Each file need a revision number so that file will not be cached multiple times. You can change the revision number once you changed the original file.

```
importScripts('https://unpkg.com/workbox-sw@2.0.3/build/importScripts/workbox-sw.prod.v2.0.3.js');

const fileManifest = [
   {
    "url": "manifest.json",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
   },
   {
    "url": "cloudinary.png",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
   },
   {
    "url": "cloudinary_logo.png",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  },
  {
    "url": "_app.component.ts",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  },
  {
    "url": "_main.ts",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  },
  {
    "url": "index.html",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  },
  {
    "url": "sw.js",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  },
  {
    "url": "systemjs.config.js",
    "revision": "df8c1f88f48f4af912acb1e6a8053bfe"
  }
];

const workboxSW = new self.WorkboxSW();

workboxSW.precache(fileManifest);
workboxSW.router.registerNavigationRoute("/index.html");
```

<!--<script src="https://gist.github.com/glauberramos/aa016e514e860cf9de16e2adbe41dd8e.js"></script>-->

# Cache external assets

Besides caching your application shell you also need to cache any external asset that your app is calling. Workbox provides a runtime caching library that you can use for that and it provides a couple of different extrategies to use. We are going to use [StaleWhileRevalidate](https://workboxjs.org/reference-docs/latest/module-workbox-runtime-caching.StaleWhileRevalidate.html#main) that caches any 200 response call and [opaque](https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses) responses. You can also with other strategies like: CacheFirst or NetworkFirst.

```
workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/(.*)', workboxSW.strategies.staleWhileRevalidate({}), 'GET');
workboxSW.router.registerRoute('https://res.cloudinary.com/dc3dnmmpx/image/upload/(.*)', workboxSW.strategies.staleWhileRevalidate({}), 'GET');
workboxSW.router.registerRoute('https://unpkg.com/(.*)', workboxSW.strategies.staleWhileRevalidate({}), 'GET');
```

<!--<script src="https://gist.github.com/glauberramos/1c87e820b9cf970c1fca8070c2765551.js"></script>-->

# Conclusion

It's crucial nowadays to optmize for slow connections and for mobile devices. PWA's solves those problem very easily, and with the power of Workbox and Cloudinary you can transform your app into a PWA very easily.

The full code for this project can be found on [Github](https://github.com/glauberramos/cloudinary-pwa-angular) also on [CodePen](https://codepen.io/glauberramos/project/editor/DnaLdk) and you can check the live version [here](https://2a75b8d4c4844eb29f3e33f1a9ade1dd.codepen.website/).
