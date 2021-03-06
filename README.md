# Redaxe

Redaxe is a simpler state container for your front-end applications. It is inspired by Redux's global state, but gets rid of the application separate of actions and reducers. Instead the 'Redaxe' way is to import your state directly into each component and whenever you want to update the state, you call the `update` function and give it the new state. When update is called, Redaxe automatically re-renders your application. Currently Redaxe works best with Immutable, however you can give it normal Javascript objects instead if you wish.

Redaxe can be used with any front-end that allows you to 'refresh' your application, but currently has only been tested with React.

## Installation

```bash
$ npm install --save redaxe
```

## API

Redaxe is super simple and only has a few exports:

* `createStore(initialData: Object, middleware: ?Array) returns render: Function` - default export to create store
* `update(newState)` - function that takes your newState and updates the db
* `db` - your state for reading (Do not write directly to the db)

## Setting up with React

To get things going we need to call `createStore` with your initial state. The first is the initial data for your application. This could be an empty object or an Immutable object.

```js
//App.js

import createStore from 'redaxe'

let initialData = {
  foo: bar,
}

const render = createStore(Immutable.fromJS(initialData))

export default render

//Index.js
import React from 'react'
import render from './app'
import Main from './Main' //Root React Component

render(
  () => ReactDOM.render(<Main />, document.getElementById('root'))
)

```

You must run your createStore to setup your database first before anything else or nothing will run. The createStore will return a render function for your app where you can inject your own renderer into it that will run when the App updates. For React that is the `ReactDOM.render`. If you are using [`react-redaxe`](https://github.com/jefflau/react-redaxe) to `connect()` your db to your components, you must create your store before you import any components as the db won't have been initialised then.

## Adding middleware

Redax also supports middleware that takes the new state and can use it before the data has been updated to the database or rendered to the client. The second parameter is an array of the middleware functions. Here we can see a simple example with a logger function. You can add your own layer such as syncing data to local storage.

```js
import createStore from 'redaxe'
import Main from './Main'
import { fromJS } from 'Immutable'

let initialData = {
  foo: bar,
}

function RedaxeImmutableLogger (state) {
  console.log('currentState')
  console.log(state.toJS())
  return state
}

let middleware = [RedaxeImmutableLogger]

createStore(
  Immutable.fromJS(initialData),
  middleware
)

```

## Reading from the state

Reading state is easy as importing the app object. The data is saved under the `db` property of your app object. You could pass them through as props, but Redaxe will automatically re-render your app every time it updates so there is no need to use props.

```js
import React from 'react'
import { db } from 'redaxe'

//Immutable
const Component = () =>
  <div>{db.get('foo')}</div>


//Normal objects
const Component = () =>
  <div>{db.foo}</div>

```

## Writing to the state

Writing to the state is easy as well. Instead of mutating the object directly, you must call the `update` method and give it a new version of the state. If you mutate the state directly, then Redaxe will not call the render function for you and your app will not update.

```js
import React from 'react'
import { db, update } from 'redaxe'

//Immutable
function handleStateChange() {
  update(
    db.set('foo', 'barbar')
  )
}
//Normal Objects using spread operator
function handleStateChange() {
  update(
    {
      ...db,
      foo: 'barbar'
    }
  )
}

const Component = () => <div>
  <div>{db.get('foo')}</div>
  <button onClick={handleStateChange}>Change to bar</button>
</div>
```

## Abstracting updaters to a separate file

When your app becomes larger and you may end up reusing the same update functions over and over, you can abstract them into a separate file. In Redaxe we call them 'updaters' as they update the state. We will use immutable.js for the rest of these examples, but you could also use normal objects in the same way

```js
// updaters.js
import { db, update } from 'redaxe'
export function updateFoo(value){
  update(
    db.set('foo', value)
  )
}

// app.js
import React from 'react'
import { db } from 'redaxe'
import { updateFoo } from './updaters'

function handleStateChange(value) {
  updateFoo(value)
}

const Component = () => <div>
  <div>{db.get('foo')}</div>
  <button onChange={(event) => handleStateChange(event.value)}>Change to bar</button>
</div>
```


## Abstraction to reducers to make things testable

For a small application you might want to do away with tests, and that's why Redaxe is flexible in the way you gradually abstract your updaters and handlers into different files. However when your app grows you can abstract the part of your updaters that are directly responsible for updating the app state into reducer functions, that take the current state and the new piece of data and return the next state. This allows us to pass in any application state we want at test time.

```js
// updaters.js
import { db, update } from 'redaxe'

export const updateFooReducer = (db, value) =>
  db.set('foo', value)

export function updateFoo(value){
  update(updateFooReducer(db, value))
}

// updaters.test.js using Jest

import { updateFooReducer } from './updaters'
import { fromJS } from 'immutable'

test('fooReducer', () => {
  let db = fromJS({
    foo: 'bar'
  })
  expect(updateFooReducer(db, 'barbar')).toBe(fromJS({
    foo: 'barbar'
  }))
})
```

##Complimentary Packages

* [`react-redaxe`](https://github.com/jefflau/react-redaxe) - React helpers for Redaxe
