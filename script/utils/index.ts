export function indexToRange(index:number) {
  let start = Math.floor((index-1)/100)*100+1
  let end = start+99
  return `${start.toString().padStart(4, '0')}-${end.toString().padStart(4, '0')}`
}


export let msg = ""

export function LogToInfo(message:string){
  msg += message+"\n"
}