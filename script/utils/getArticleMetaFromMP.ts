import { SourceInfo } from "../interfaces";

/**
 * fetch latest ${cnt} articles data from wechat mp
 */
export const getArticle = async (bizId:string, albumId:string,cnt = 1) => {
  let url = `https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=${bizId}&album_id=${albumId}&count=${cnt}&f=json`
  const response = await fetch(url);
  let res:any = await response.json()
  let ret = res["base_resp"]
  if(ret === undefined) {
    return null
  }
  let articleList = res["getalbum_resp"]["article_list"]
  if (articleList === undefined) {
    return null
  }else if(articleList.constructor !== Array){
    articleList = [articleList]
  }

  let ans:SourceInfo = {
    msgid:articleList[0]["msgid"],
    url:articleList[0]["url"],
    title:articleList[0]["title"],
    date:articleList[0]["create_time"],
  }
  return ans
}