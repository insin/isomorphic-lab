## Isomorphic Lab

![logo](https://github.com/insin/isomorphic-lab/raw/master/logo.png)

This repo is being used to experiment with writing isomorphic JavaScript apps with [React](http://facebook.github.io/react/) 0.13.X, [React Router](https://github.com/rackt/react-router) 1.0.0-betaX and [express](https://github.com/strongloop/express).

It uses [newforms](https://github.com/insin/newforms) for form display and validation on both ends - this could be done manually with any component which can populate its form fields and display error messages based on its props and state, though.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Functionality](#functionality)
  - [Data fetching](#data-fetching)
  - [Title generation ([source](https://github.com/insin/isomorphic-lab/blob/master/src/utils/getTitle.js))](#title-generation-sourcehttpsgithubcominsinisomorphic-labblobmastersrcutilsgettitlejs)
- [Client rehydration](#client-rehydration)
- [Express middleware ([source](https://github.com/insin/isomorphic-lab/blob/payload/src/react-router-middleware.jsx))](#express-middleware-sourcehttpsgithubcominsinisomorphic-labblobpayloadsrcreact-router-middlewarejsx)
  - [`options.title`](#optionstitle)
  - [Response handling](#response-handling)
    - [Successful rendering](#successful-rendering)
    - [Non-GET requests](#non-get-requests)
    - [Redirecting](#redirecting)
    - [Re-rendering](#re-rendering)
    - [Errors](#errors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Functionality

#### Data fetching

React Router's experimental `AsyncProps` is used to fetch data, with route components defining a static `loadProps(params, callback(err, data))` function, which will be called when their route is matched against the current URL.

#### Title generation ([source](https://github.com/insin/isomorphic-lab/blob/master/src/utils/getTitle.js))

Route components can define a static `title` attribute or a synchronous `getTitle(props, params)` function, which will be called when the route is matched against the current URL.

Any async props which will be passed to the component when it's rendered will be passed as the first first argument to `getTitle()`.

Each handler should only define or return its own portion of the URL. e.g. the top-level component might define the site name as a static `title`, while a nested blog post component might define a static `getTitle(props)` which returns the title of the post.

By default, these title parts will be reversed and joined with a mid-dot to form the final title to be included in a `<title>` element or set on `document.title` depending on the environment - this is configurable.

### Client rehydration

The initial render will make use of `AsyncProps.rehydrate()` with initial async props provided via a `window.__PROPS__` variable when running on the client.

### Express middleware ([source](https://github.com/insin/isomorphic-lab/blob/payload/src/react-router-middleware.jsx))

Usage:

```
var reactRouter = require('./react-router-middleware')

app.use(reactRouter(routes[, options]))
```

#### `options.title`

An object to be passed as options to `getTitle()` - available options are:

`reverse` (`true`) - should title parts be reversed into most-specific-first order before joining?

`join` (`' · '`) - string to be used to join title parts.

`defaultTitle` (`'(undefined)'`) - default title to use if none of the matched route components provide title parts.

#### Response handling

In addition to performing the common functionality described above, the express middleware handles the following scenarios:

##### Successful rendering

For a regular, successful Handler render, a `'react'` view will be rendered with the following locals:

`title` - generated document title

`html` - rendered component output

`props` - props which were used to render the component, serialised to a JSON string.

##### Non-GET requests

Non-GET request bodies will be set on the Router's location state as a `body` property.

The request method will also be available as a `method` property.

##### Redirecting

If `transition.to()` is used in an `onEnter()` hook, this will be turned into an HTTP 303 Redirect response...

##### Re-rendering

...unless the redirect location has been given some `state`. In this case, the middleware will create a new redirect location and run routing on it.

This can be used to render another route back to the user as a response, e.g. rendering a form with user input and validation errors in response to a POST request which contained an invalid body.

##### Errors

If an error is detected at any time, the middleware will call its `next()` callback with the error to allow whatever error handling middleware is configured elsewhere to pick it up.

**MIT Licensed**
