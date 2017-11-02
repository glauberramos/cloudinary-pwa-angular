Progressive Web Apps (PWA) are a easy way to improve your application's user experience and conversion rates. Adapting your app to become a PWA has become very important nowadays and many companies are already taking advantage of that and you can see here some [testimonies](https://developers.google.com/web/showcase/)

### Here is a summary of what this project will cover:

- We built a image gallery displaying the most famous digital entrepeneurs of our time

![pwa app](http://res.cloudinary.com/dc3dnmmpx/image/upload/v1507607032/pwaapp.png "PWA App")

- Our app works offline and is built with [Angular](https://angular.io/) and [Workbox](https://workboxjs.org/).
- Because Progressive Web Apps need to be fast, we used [Cloudinary](https://cloudinary.com/) to store our images that is a an end-to-end media management service.
- Native app-like behavior when launched and posibility of installing on your home screen.

We are now going to give you a step by step on how to create a simple PWA.

# Step 1 - Setting up Angular

We are going to use Angular CLI to initialize the base code for our application. Make sure you have angular CLI installed on your computer.

To create the project run:
`ng new angular-pwa`

Access your project with:
`cd angular-pwa`

Run `npm install` then `npm start` to run your application.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-1)

# Step 2 - Setting up service worker with Workbox

Service worker is a independent background process that run in the browser. It does not use the main thread and it can be used to cache your application files so you can access it offline.

We are going to create a service worker using Workbox CLI. Workbox is a set of libraries created by google to make it easier to generate your service worker.

We are going to cache the application shell. The application shell is all the static files (html, css and js) that your application contains.

Start with installing workbox-cli:

`npm install --save-dev workbox-cli`

Workbox cli uses a configuration file to generate your service worker. Create a config file `workbox-cli-config.js` in your main folder. And insert this code:

```javacript
module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{ico,html,js,map}"
  ],
  "maximumFileSizeToCacheInBytes": 5242880,
  "swDest": "dist/sw.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ]
};
```

You are basically telling Workbox to cache all your `ico,html,js,map` files and to generate a file called `sw.js` inside your `dist` folder.

Now we are going to integrate the generation inside your build process, you can chance that on your `package.json`:

`"build": "ng build && workbox-cli generate:sw"`

Now everytime you run `npm build` you are going to export all your files to `dist` folder and also generate a service worker.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-2)

# Step 3 - Image gallery with Cloudinary

Cloudinary is a media managent service that provides storage, delivery, transformation, optimization of media for your application.

We are going to use Cloudinary's Angular library to connect in our application.

`npm install cloudinary-core --save`

`npm install "@cloudinary/angular-4.x" --save`

inside your `app.module.js` file change the following code:

```javascript
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-4.x';
import { Cloudinary } from 'cloudinary-core';
```

We already created an user on Cloudinary and uploaded some images to serve on our application. You will need to setup your user cloud name on the following code inside `app.module.js`:

```javascript
imports: [
  BrowserModule,
  CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dc3dnmmpx' } as CloudinaryConfiguration)
]
```

### Create card component

We are going going to create our image library. First create a folder called `card` inside `src` folder. And generate 3 files:

`card.component.html`

```html
<div class="card-content">
  <cl-image public-id={{id}} class="thumbnail inline" format="jpg"></cl-image>
  <h4>{{title}}</h4>
  <p>{{desc}}</p>
</div>
```

`card.component.ts`

```javascript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() id: string;
  @Input() title: string;
  @Input() desc: string;
}
```

`card.component.css`

```javascript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() id: string;
  @Input() title: string;
  @Input() desc: string;
}
```

Now we need to add the card component inside `app.module.js`

```javascript
import { CardComponent } from '../card/card.component';
```

```javascript
declarations: [
  AppComponent,
  CardComponent
]
```

Now we need to use the inside app.component.html

```html
<header>
  <span>Internet Entrepreneurs Gallery</span>
</header>
<main>
  <div class="wrapper">
    <div class="cards">
      <card id="google" title="Larry Page and Sergey Brin" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
      <card id="facebook" title="Mark Zuckerberg" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
      <card id="apple" title="Steve Jobs" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
      <card id="microsoft" title="Bill Gates" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
      <card id="amazon" title="Jeff Bezos" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
      <card id="tesla" title="Elon Musk" desc="Lorem ipsum dolor sit amet, ea postea graeci meliore pro. Stet choro nostrum ex quo, est dicant nonumy philosophia ne. "></card>
    </div>
  </div>
</main>
```

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-3)

# Step 4 - Cache external calls

We already cached our application files but now we need to cache all external calls that our app is calling. In order to use the service worker we need to add a code to install it inside `index.html`

```html
<script>
if (navigator.serviceWorker) {
 navigator.serviceWorker.register('./sw.js')
 .catch(function(err) {
   console.error('Unable to register service worker.', err);
 });
}
</script>
```

Now that we have our service worker installed let's add a configuration inside `workbox-cli-config.json`. This code will cache any call to Cloudinary services and will will execute runtime caching.

```javascript
"runtimeCaching": [
{
  urlPattern: 'https://res.cloudinary.com/dc3dnmmpx/image/upload/(.*)',
  handler: 'staleWhileRevalidate'
}
```

This was the last step to make our app work offline. Now we need to make our app behave like a native app and be able to be installed in your device homescreen.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-4)

# Step 5 - Adding a manifest.json

Adding a `manifest.json` is essential if you want your app to look like a native app. It will make your app have a splash screen, be able to be installed on a device home-screen and also hide the native URL bar from the browser.

```json
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

We need to make `angular-cli.json` to copy the manifest.json and our logo `cloudinary.png` to dist folder. You can make this happen with this change:

```json
"assets": [
  "assets",
  "favicon.ico",
  "cloudinary.png",
  "manifest.json"
]
```

We are also going to update our `index.html` with all meta tags for enable mobile support and to link our `manifest.json`

```html
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="application-name" content="cloudinary-pwa-angular">
<meta name="apple-mobile-web-app-title" content="cloudinary-pwa-angular">
<meta name="theme-color" content="#0e2f5a">
<meta name="msapplication-navbutton-color" content="#0e2f5a">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="msapplication-starturl" content="/">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="manifest" href="manifest.json">
<link rel="icon" href="cloudinary_logo.png">
<link rel="apple-touch-icon" href="cloudinary_logo.png">
```

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-5)

# Conclusion

It's crucial nowadays to optmize for slow connections and for mobile devices. PWA's solves those problem very easily, and with the power of Workbox and Cloudinary you can transform your app into a PWA very easily.

The full code for this project can be found on [Github](https://github.com/glauberramos/cloudinary-pwa-angular) also on [CodePen](https://codepen.io/glauberramos/project/editor/DnaLdk) and you can check the live version [here](https://2a75b8d4c4844eb29f3e33f1a9ade1dd.codepen.website/).


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
