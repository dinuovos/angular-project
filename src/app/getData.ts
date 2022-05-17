export function getData(data:string){
  let d = new Date(data);
  const offset = d.getTimezoneOffset()
  d = new Date(d.getTime() - (offset * 60 * 1000))
  return d.toISOString().split('T')[0]
}
