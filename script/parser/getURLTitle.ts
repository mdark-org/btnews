import * as cheerio from "cheerio";

export const getURLTitle = (url:string,retries = 3) => {
    return fetch(url)
        .then(res =>{
            return  res.text()
        })
        .then(function (responseText) {
            // charset 会导致部分网页标题解析乱码.,例如搜狐使用GBK http://news.sohu.com/20081105/n260444580.shtml
            // 部分网站存在反爬机制,比如百度百家号 :-(
            const $ = cheerio.load(responseText);
            return $('title').text()
        }).catch(function(error) {
            if (retries > 0) {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve(getURLTitle(url, retries - 1));
                    }, 3000);
                });
            }
            throw error;
        });
}