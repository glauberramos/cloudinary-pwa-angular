Progressive Web Apps (PWA) are a easy way to improve your application's user experience and conversion rates. PWAs are a set of techniques and technologies to enable your app to have the same characteristics of a native app. Many companies are already doing that, you can check some of those companies testimonies [here](https://developers.google.com/web/showcase/).

We are going to build a simple app to showcase how easy is to build a PWA and this post contains a step by step guide to show you how do do it.

### Here is a summary of what this project will cover:

- We built a image gallery displaying the most famous digital entrepeneurs of our time

![pwa app](http://res.cloudinary.com/dc3dnmmpx/image/upload/v1510107772/pwaapp.png "PWA App")

- Our app works offline and is built with [Angular](https://angular.io/) and [Workbox](https://workboxjs.org/).
- Because Progressive Web Apps need to be fast, we used [Cloudinary](https://cloudinary.com/) to store our images that is a an end-to-end media management service.
- Native app-like behavior when launched and posibility of installing on your home screen.

# Step 1 - Setting up Angular

We are going to use Angular CLI to initialize the basecode for your application. Make sure you have angular CLI installed on your computer and the latest version of node and npm.

To create the project run `ng new angular-pwa`

Access your project with `cd angular-pwa` and run `npm start` to start your application.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-1).

# Step 2 - Setting up service worker with Workbox

Service worker is a independent background process that run in the browser. It does not use the main thread and it can be use to cache your application files so you can access it offline.

We are going to create a service worker using Workbox CLI. Workbox is a set of libraries created by Google to make it easy to generate your service worker.

We are going to first cache all the static files of your aplication (HTML, CSS and JS). That is also called Application Shell.

Start with installing workbox-cli:

`npm install --save workbox-cli`

Workbox cli uses a configuration file to generate your service worker. Create a config file `workbox-cli-config.js` in your project root folder. And insert this code:

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

You are basically telling Workbox to cache all your `ico, html, js, map` files and to generate a file called `sw.js` inside your `dist` folder.

Now we are going to integrate the generation inside your build process, you can change that on your `package.json`:

`"build": "ng build && workbox generate:sw",`

Now everytime you run `npm run build` you are going to export all your files to `dist` folder and also generate a service worker.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-2).

# Step 3 - Image gallery with Cloudinary

Cloudinary is a media managent service that provides storage, delivery, transformation, optimization of media for your application.

We are going to use Cloudinary's Angular library to connect in our application.

`npm install cloudinary-core --save`

`npm install "@cloudinary/angular-4.x" --save`

inside your `src/app/app.module.ts` file add the following code:

```javascript
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-4.x';
import { Cloudinary } from 'cloudinary-core';
```

We already created an user on Cloudinary and uploaded some images to serve on our application. If you want to can create your own and update the `cloud_name` property. Now change the following code inside `src/app/app.module.ts`:

```javascript
imports: [
  BrowserModule,
  CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dc3dnmmpx' } as CloudinaryConfiguration)
],
```

### Create Card component

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

```css
:host {
  background: #f5f5f5;
  padding: 10px;
  display: inline-block;
  margin: 0 0 1em;
  width: 100%;
  cursor: pointer;
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
  transition: all .1s ease-in-out;
}

:host:hover {
  transform: translateY(-0.5em);
  background: #EBEBEB;
}
```

Now we need to add the Card component inside `src/app/app.module.js`

```javascript
import { CardComponent } from '../card/card.component';
```

```javascript
declarations: [
  AppComponent,
  CardComponent
],
```

Now we need to use the Card inside `src/app/app.component.html`. You can just replace the whole file with the following code:

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

Also add the following code inside `src/app/app.component.css`

```css
.cards {
  column-count: 1;
  column-gap: 1em;
}

.wrapper {
  padding: 15px;
}

header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495e;
    color: #fff;
}

header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
}

@media only screen and (min-width: 500px) {
  .cards {
    column-count: 2;
  }
}

@media only screen and (min-width: 700px) {
  .cards {
    column-count: 3;
  }
}

```

And the folloing code to `src/styles.css`

```css
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: #2c3e50;
  margin: 0;
}

img {
  display: block;
  width: 100%;
}
```

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-3).

# Step 4 - Cache external calls

We already cached your application files but now we need to cache all external calls that our app is doing. In order to use the service worker we need to add a code to install it inside `src/index.html`

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

Now that we have our service worker installed let's add a configuration inside `workbox-cli-config.json`. This code will cache any call to Cloudinary services and will will execute runtime caching. If you created your own Cloudinary user, you need to update it here as well.

```javascript
"runtimeCaching": [{
  urlPattern: 'https://res.cloudinary.com/dc3dnmmpx/image/upload/(.*)',
  handler: 'staleWhileRevalidate'
}],
```

This was the last step to make your app work offline. Now we need to make your app behave like a native app and this will enable it to be installed in your device homescreen.

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-4).

# Step 5 - Adding a manifest.json

Adding a `src/manifest.json` is essential if you want your app to look like a native app. It will make your app have a splash screen, be able to be installed on a device home-screen and also hide the native URL bar from the browser. Please add it inside `src` folder.

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

We also need a image to be displayed when you install your app in your device. We used this image [here](https://github.com/glauberramos/cloudinary-pwa-angular/blob/master/src/cloudinary.png), and we added inside `src` folder.

Everytime you run `npm run build`, all the files for your application are generated inside `dist` folder. Since we added two new files we need to update the code for copying those files as well.
 
We need to make `angular-cli.json` to copy the manifest.json and our logo `cloudinary.png` to `dist` folder. You can make this happen with this change:

```json
"assets": [
  "assets",
  "favicon.ico",
  "cloudinary.png",
  "manifest.json"
],
```

We are also going to update our `src/index.html` with all meta tags to enable mobile support and to link our `src/manifest.json`

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

You can check the final code for this step [here](https://github.com/glauberramos/cloudinary-pwa-angular/tree/angular-pwa-step-5).

# Final step - Deploy

Now that we finished the code you can run `npm run build` and go inside `dist` folder. We used Surge to host our app, but you can use any service for that. 

If you want to use Surge you need to have it installed `npm install -g surge` and then just run `surge` inside the `dist` folder. You can check our app live here [https://angular-pwa.surge.sh/](https://angular-pwa.surge.sh/). Just make sure you access it using HTTPS because PWAs requires secure access.

If you want to check if your files are really being cached, go inside the tab `network` on chrome developer tools. The column Size should contain `(from ServiceWorker)`.

![service worker](http://res.cloudinary.com/dc3dnmmpx/image/upload/v1510111279/serviceworker.png)

# Conclusion

It's crucial nowadays to optmize for slow connections and for mobile devices. PWA's solves those problem very easily, and with the power of Workbox and Cloudinary you can transform your app into a PWA very easily.

The full code for this project can be found on [Github](https://github.com/glauberramos/cloudinary-pwa-angular) and you can check the live version [here](https://angular-pwa.surge.sh/).