export let db
export let render
       let middleware

export function update(newData){
  let data = middleware.reduce((state, middleware) => middleware(state), newData)
  db = data;
  render()
}

export default function redaxeInit(initialData, renderer, middleware){
  db = initialData
  render = renderer
  middleware = middleware
  render()
}
