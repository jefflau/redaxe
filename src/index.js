export let db
       let render,
           middleware,
           renderFunc

export function update(newData){
  let data = middleware.reduce((state, middleware) => middleware(db, state), newData)
  db = data;
  renderFunc()
}

export default function createStore(initialData, middlewares = []){
  function render(renderer){
    renderFunc = renderer
    renderFunc()
  }
  db = initialData
  middleware = middlewares
  return render
}
