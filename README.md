## Isomorphic Lab

This repo is being used to experiment with writing isomorphic JavaScript apps
with [React](http://facebook.github.io/react/),
[React Router](https://github.com/rackt/react-router) and
[express](https://github.com/strongloop/express).

It uses [newforms](https://github.com/insin/newforms) for form display and
validation on both ends - this could be done manually with any component which
can populate its form fields and display error messages based on its props and
state, though.

See [insin/newforms#55](https://github.com/insin/newforms/issues/55#issuecomment-67756422)
for discussion of implementation details.

### Common functionality

Before the top-level Handler for the current URL is rendered, the following will
be done regardless of whether or not the app is running on the client or server:

#### [`Data Fetching`](https://github.com/insin/isomorphic-lab/blob/master/src/utils/fetchData.js)

Route handlers can define a static `fetchData([params,] callback)` function,
which will be called when their route is matched against the current URL. This
can be used to asynchronously load any data required by the component up-front,
calling the callback when done.

Data will be passed as a `data` prop to the top-level Handler, with data
returned from `fetchData()` calls keyed by route name.

Use JSX spread attributeso to pass this all the way down the chain of route
handlers:

```javascript
<RouteHandler {...this.props}/>
```

#### [`Title Generation`](https://github.com/insin/isomorphic-lab/blob/master/src/utils/getTitle.js)

Route handlers can define a static `title` attribute or a synchronous
`getTitle(props, params)` function, which will be called when the corresponding
route is matched against the current URL.

Any props which will be passed to the top-level Handler will be passed as the
first argument to `getTitle()` - this will include a `data` prop containing any
data retrieved via the handler's own `fetchData()` function, should it need to
use it as part of the title.

Each handler should only define or return its own portion of the URL. e.g. the
top-level component might define the site name as a static `title`, while a nested
blog post component might define a static `getTitle(props)` which returns the
title of the post.

By default, these title parts will be reversed and joined with a mid-dot to form
the final title to be included in a `<title>` elemnt or set on `document.title`
depending on the environment - this is configurable, though.

### Client rehydration

If `fetchData()` finds a `window.__PROPS__` variable when running on the client,
it will return the variable's value via its callback then delete the variable.

### [Express middleware](https://github.com/insin/isomorphic-lab/blob/master/src/react-router-middleware.jsx)

Usage:

```
var reactRouter = require('./react-router-middleware')

app.use(reactRouter(routes[, options]))
```

#### `options.title`

An object to be passed as options to `getTitle()` - available options are:

`reverse` (default: `truer`) - should title parts be reversed into most-specific-first
order before joining?

`join` (default: `' · '`) - string to be used to join title parts.

`defaultTitle` (default: `'(undefined)'`) - default title to use if none of the
matched route handlers provide title parts.

#### Response handling

In addition to performing the common functionality described above, the express
middleware handles the following scenarios:

##### Successful rendering

For a regular, successful render, a `'react'` view will be rendered with the
following locals:

`title` - generated document title

`html` - rendered component output

`props` - props which were used to render the component, serialised to a JSON
string.

##### 404 rendering

If the `NotFoundRoute` is rendered at the top-level (note: this check is currently
hardcoded to check a specific route name), a `'react-404'` view will be rendered
with the following locals:

`title` - generated document title

`html` - rendered component output

##### POST requests

Post request bodies will be added to the query object received by a route
handler's static `willTransitionTo(transition, prarms, query)` function.

A `_method` parameter equal to `'POST'` will also be added to distinguish POST
requests from others.

##### Redirecting

If `transition.redirect() is used in a `willTransitionTo()`, this will be turned
into an HTTP 303 Redirect response.

##### Re-rendering

If a [`Render`](https://github.com/insin/isomorphic-lab/blob/master/src/utils/Render.js)
object is passed to `transition.abort()`, the middleware will run the router
again for the given URL, passing any extra props given to the Handler for the
URL.

This can be used to render the correct page back to the user with additional
data it needs for display without having to serialize data into a query string
or onto a session and redirecting them.

##### Errors

If an error is detected at any time, the middleware will call its `next()`
callback with the error to allow whatever error handling middleware is
configured elsewhere to pick it up.

### MIT Licensed