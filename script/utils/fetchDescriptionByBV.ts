
export default async function fetchDescriptionByBV(bv:string) {
  const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`)
  try {
    const json:any = await res.json()
    return json["data"]["dynamic"]
  }catch(e) {
    return ""
  }
}