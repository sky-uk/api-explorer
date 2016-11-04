## 0.2.6 (November 4, 2016)

* Adds CHANGELOG.md file to track version changes
* Improve the NPM package publishing process using Circle CI (#141)
* Fix: Configuration is a required argument for minimal configuration (#151)
* Use base64 urls instead of external images to display logo and 404 (#103)
* Fix support for custom base paths. Some client URLs are broken (home, operation tabs, settings) (#154)
* Improve documentation to list the `petstore-api-explorer` sample project (#120)
* Improve documentation for minimal API Explorer configuration

## 0.2.5 (Aug 12, 2016)

* Better support for custom base paths.


## 0.2.4 (Aug 18, 2016)

* Fixes to Swagger 1 loader
* Support for "/" basePath
* Fixes a bug where previously sent headers were sent out with undefined once they get empty again.
* Change API Explorer package name to avoid conflicts with another project once we need to deploy to the public NPM registry
* Now showing all the request and response headers
* Response widget was using the request format instead of the content type


## 0.2.3 (Aug 12, 2016)

Minor bug fixes


## 0.2.2 (Jun 23, 2016)

Republish NPM package.


## 0.2.1 (Jun 17, 2016)

> please don't use this version

Republish NPM package.


## 0.2.0 (Jun 17, 2016)

> This version includes some bug fixes and general improvements:

* Allow .configPlugins to be optional
* Add support for redux-devtools-extension (Chrome)
* Better handling for empty responses
* Better support for CORS (Access-Control-Allow-Credentials is now configurable)
* Fix header parameters not being sent on requests
* Swagger2: Use host serving the API spec when the host field is not provided
* Swagger2: Ignore empty definitions field
* Fix operations with only optional parameters not allowing requests without filling parameters
* New DSL supporting configuration by API:

```js
APIExplorer
  .addAPI('petstore', 'swagger2', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', c => {
    c.addHeader('X-Foo', 'Some Value')
    c.addHeader('X-Bar', 'Another Value')
    c.useProxy(true)
  })
  .addWidgetTab('HATEOAS', APIExplorer.HATEOASWidget)
  .addPlugin(samplePlugin)
  .configCORS({ credentials: 'omit' })
  .start()
```


## 0.1.0 (Jun 5, 2016)

> This is the first open-source release of API Explorer

* Clean UI
* Multiple APIs
* Loaders for Swagger version 1.0 and 2.0 (internal representation is Swagger 2)
* Specification interceptors (for tweaks)
* Custom HTTP Headers
* Extensible tab widgets
* Built-in proxy for bypass CORS restrictions
* Plugin system
* Customisable CodeMirror line widget via HTTP Response interceptor
* Settings Panes
* Built-in samples (sampleapps)
