export let db
       let render,
           middleware

export function update(newData){
  let data = middleware.reduce((state, middleware) => middleware(state), newData)
  db = data;
  render()
}

export default function redaxeInit(initialData, renderer, middlewares = []){
  db = initialData
  render = renderer
  middleware = middlewares
  render()
}
