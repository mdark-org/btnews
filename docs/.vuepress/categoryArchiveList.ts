type categoryArchive = {
  category: string
  archiveList: Archive[]
}
type Archive = {
  name : string
  content: string[]
}



export const categoryArchiveList: categoryArchive[] = [{
  category: "btnews",
  archiveList:[
    {
      name: "社会化抚养",
      content: ["btnews_0296","btnews_0360","btnews_0400"]
    },
    {
      name: "年度新闻合订本",
      content: ["btnews_0215","btnews_0216","btnews_0386"]
    },
    {
      name: "老朋友以岭药业",
      content: ["btnews_0288","btnews_0424"]
    },
    {
      name: "俄乌战争合订本",
      content: ["btnews_0310","btnews_0390"]
    },
    {
      name: "AI与新闻",
      content: ["btnews_0374","btnews_0184","btnews_0233","btnews_0363","btnews_0378"]
    },
    {
      name: "集成电路国产化进程",
      content: ["btnews_0167","btnews_0184","btnews_0233","btnews_0363","btnews_0378"]
    },
    {
      name: "智利新宪法改革历史",
      content: ["btnews_0301"]
    },
    {
      name: "戈尔巴乔夫专题",
      content:["btnews_0304","btnews_0387"]
    }
  ]
},
{
  category:"refnews",
  archiveList:[]
}]
// 自定义合集
export const archiveNavbar = () => {
  let al = categoryArchiveList[0].archiveList
  let res = []
  for (let i = 0; i < al.length; i++) {
    res.push({
      text: al[i].name,
      link: `/btnews/archive/${al[i].name}/`
    })
  }
  return res
}