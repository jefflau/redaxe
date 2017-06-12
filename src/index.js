let db,
    render,
    middleware

function update (newData) {
  let data = this.middleware.reduce((state, middleware) => middleware(state), newData)
  db = data;
  render()
}

function redaxeInit (initialData, renderer, middleware) {
  db = initialData
  render = renderer
  middleware = middleware
}

export default db
export {
  render,
  update,
  redaxeInit
}
