## 0.6.0 (..., 2017)

### Development

* Adopted [Lerna](https://lernajs.io/) project structure 

## 0.5.0 (August 30, 2017)

### Enhancement

* [#135](https://github.com/sky-uk/api-explorer/issues/135) - Use default parameter values when available
* Add basic examples support for input parameters
* CURL generator tab sample plugin in the Links sample

## 0.4.0 (March 17, 2017)

As part of this release we had [4 issues](https://github.com/sky-uk/api-explorer/milestone/8?closed=1) being closed.

### Documentation 

* [#157](https://github.com/sky-uk/api-explorer/issues/157) - Write documentation for APIExplorer API 

### Enhancement 

* [#172](https://github.com/sky-uk/api-explorer/issues/172) - Display custom header values in parameters of type header 
* [#60](https://github.com/sky-uk/api-explorer/issues/60) - Keep the last response for an operation in the state 

### Development 

* [#170](https://github.com/sky-uk/api-explorer/issues/170) - Remove the dependency for DevTools 



## 0.3.0 (December 29, 2016)

As part of this release we had [8 issues](https://github.com/sky-uk/api-explorer/milestone/6?closed=1) being closed.

### Enhancement

* [#168](https://github.com/sky-uk/api-explorer/issues/168) - Misc improvements
* [#156](https://github.com/sky-uk/api-explorer/issues/156) - Option to not follow redirects
* [#143](https://github.com/sky-uk/api-explorer/issues/143) - Missing badges for HEAD, OPTIONS and PATCH

### Bug

* [#159](https://github.com/sky-uk/api-explorer/issues/159) - Status code (and headers) are not shown for some status codes (ex: 204, 500)
* [#51](https://github.com/sky-uk/api-explorer/issues/51) - Remove support for url spec in querystring
* [#144](https://github.com/sky-uk/api-explorer/issues/144) - Should warn instead of fail when a spec is not available
* [#160](https://github.com/sky-uk/api-explorer/pull/160) - Warn instead of failing when API Spec load fails


## 0.2.7 (November 7, 2016)

* Allow to specify a pathname only URL for swagger spec (#152)
* Use absolute path for README.md image
* Only include dist files in NPM (#155)

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
