#Redaxe

Redaxe is a simpler state container for your front-end applications. It is inspired by Redux's global state, but gets rid of the application separate of actions and reducers. Instead the 'Redaxe' way is to import your state directly into each component and whenever you want to update the state, you call the `update` method and give it the new state. When update is called, Redaxe automatically re-renders your application. Currently Redaxe works best with Immutable, however you can give it normal Javascript objects instead if you wish.

Redaxe can be used with any front-end that allows you to 'refresh' your application, but currently has only been tested in React.

##Installation

```bash
$ npm install redaxe
```

##Setting up with React

After you import the Redaxe class, you must instantiate it with at least two arguments. The first is the initial data for your application. This could be an empty object or an Immutable object. Redaxe makes no assumptions about your data, however we've it easier to use Immutable's database like API for deeply nested maps/objects.

The second is a function to

```js
//App.js

import React from 'react'
import Redaxe from 'redaxe'
import Main from './Main' //Root React Component

let initialData = {
  foo: bar,
}

const app = new Redaxe(
  Immutable.fromJS(initialData),
  () => ReactDOM.render(<Main />, document.getElementById('root'))
)

export default app
```

Once you have setup your app object, you must then call the render function once to get your application running:

```js
//index.js
import app from './app'

app.render()
```

##Adding middleware

Redax also supports middleware that takes the new state and can use it before the data has been updated to the database or rendered to the client. The third parameter is an array of the middleware functions. Here we can see a simple example with a logger function. You can add your own layer such as syncing data to localstorage.

```js
import React from 'react'
import Redaxe from 'redaxe'
import Main from './Main'

let initialData = {
  foo: bar,
}

function RedaxeImmutableLogger (state) {
  console.log('currentState')
  console.log(state.toJS())
  return state
}

let middleware = [RedaxImmutableLogger]

const app = new Redaxe(
  Immutable.fromJS(initialData),
  () => ReactDOM.render(<Main />, document.getElementById('root')),
  middleware
)

export default app
```

##Reading from the state

Reading state is easy as importing the app object. The data is saved under the `db` property of your app object. You could pass them through as props, but Redaxe will automatically re-render your app every time it updates so there is no need to use props.

```js
import app from './app'

//Immutable
const Component = () =>
  <div>{app.db.get('foo')}</div>


//Normal objects
const Component = () =>
  <div>{app.db.foo}</div>

```

##Writing to the state

Writing to the state is easy as well. Instead of mutating the object directly, you must call the `update` method and give it a new version of the state. If you mutate the state directly, then Redaxe will not call the render function for you and your app will not update.

```js
import app from './app'

//Immutable
function handleStateChange() {
  app.update(
    app.db.set('foo', 'barbar')
  )
}
//Normal Objects using spread operator
function handleStateChange() {
  app.update(
    {
      ...app.db,
      foo: 'barbar'
    }
  )
}

const Component = () =>
  <div>{app.db.get('foo')}</div>
  <button onClick={handleStateChange}>Change to bar</button>
```

And that is pretty much it! When your app becomes larger and you end up reusing the same update functions over and over, you can abstract them into a separate file. In Redaxe we call them 'updaters' as they update the state.
