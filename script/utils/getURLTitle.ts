import * as cheerio from "cheerio";

export default async function getURLTitle(url:string,retries = 3) {
  try {
    const res = await fetch(url);
    const responseText = await res.text();
    // charset 会导致部分网页标题解析乱码.,例如 http://news.sohu.com/20081105/n260444580.shtml
    // 部分网站存在反爬机制，部分情况下，会被屏蔽,比如百度百家号 :-(
    const $ = cheerio.load(responseText);
    return $('title').text();
  } catch (error) {
    if (retries > 0) {
      return new Promise(function (resolve) {
        setTimeout(()=>resolve(getURLTitle(url, retries - 1)), 3000);
      });
    }
    return "";
  }
}