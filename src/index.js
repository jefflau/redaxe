export let db
       let render,
           middleware,
           renderFunc

export function update(newData){
  let data = middleware.reduce((state, middleware) => middleware(state), newData)
  db = data;
  renderFunc()
}

export default function createStore(initialData, middlewares = []){
  db = initialData
  middleware = middlewares
}

export function render(renderer){
    if(renderer){
      renderFunc = renderer
    }
    renderFunc()
}
