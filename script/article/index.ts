import {SourceInfo} from "../type";

export const getArticle =async (cnt = 1)=>{
    let url = `https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=Mzk0MTIzNTc0NQ==&album_id=3119370632720400390&count=${cnt}&f=json`
    const response = await fetch(url);
    let res = await response.json()
    let ret = res.base_resp
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
        date:articleList[0]["create_time"]
    }
    return ans
}