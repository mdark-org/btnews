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
      name: "老朋友以岭药业",
      content: ["btnews_0288","btnews_0417","btnews_0422","btnews_0424","btnews_0425","btnews_0430","btnews_0438","btnews_0538","btnews_0560"]
    },
    {
      name: "俄乌战争合订本",
      content: ["btnews_0002","btnews_0310","btnews_0390","btnews_0427","btnews_0510","btnews_0535","btnews_0555","btnews_0558"]
    },
    {
      name: "社会化抚养",
      content: ["btnews_0296","btnews_0360","btnews_0400","btnews_0541","btnews_0544"]
    },
    {
      name: "介绍新冠治疗药品：阿兹夫定片、清肺排毒颗粒、Paxlovid",
      content: ["btnews_0421","btnews_0474","btnews_0539"]
    },
    {
      name: "年度新闻合订本",
      content: ["btnews_0215","btnews_0216","btnews_0386","btnews_0466","btnews_0467","btnews_0468","btnews_0531","btnews_0532","btnews_0533"]
    },
    {
      name: "新朋友正威集团",
      content: ["btnews_0504","btnews_0506","btnews_0517","btnews_0518"]
    },
    {
      name: "集成电路国产化进程",
      content: ["btnews_0167","btnews_0184","btnews_0233","btnews_0363","btnews_0378","btnews_0470","btnews_0482","btnews_0492","btnews_0507"]
    },
    {
      name: "AI与新闻",
      content: ["btnews_0374","btnews_0488","btnews_0490"]
    },
    {
      name: "智利新宪法改革历史",
      content:["btnews_0033","btnews_0301","btnews_0489"]
    },
    {
      name: "高流说航天",
      content: ["btnews_0435","btnews_0449","btnews_0452","btnews_0453"]
    },
    {
      name: "戈尔巴乔夫专题",
      content:["btnews_0304","btnews_0387","btnews_0481","btnews_0483"]
    },
  ]
},
{
  category:"refnews",
  archiveList:[]
}]

// 自定义合集
export const archiveNavbar = () => {
  let al = categoryArchiveList[0].archiveList
  let res:any = []
  for (let i = 0; i < al.length; i++) {
    res.push({
      text: al[i].name,
      link: `/btnews/archive/${al[i].name}/`
    })
  }
  return res
}