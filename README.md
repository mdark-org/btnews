# btnews
这是一个睡前消息文稿的存档仓库

[在线查看](https://vp-btnews.ktlab.io)

最初该仓库是作为睡前消息文稿内容的存档仓库存在的，此次更新之后（2024.04.15）有意愿引入其他栏目的同类型的内容。

当前 master 分支仅存储文稿内容以及微信公众号文稿抓取脚本。
### clone
如果你需要 clone 该仓库并提交内容，请务必使用 单分支 clone，大小约为 1G（images 文件），全量 clone 过大 4g（优化中）
```
git clone -b master --single-branch https://github.com/ktKongTong/btnews
```
### breaking change
##### 2024.04.15 重大变更
新增 content(现 master) 和 vitepress 分支。
将 原 master 分支转为 vuepress 分支，不再花费更多精力维护。
具体用途可见下文

### branch 说明
> [!IMPORTANT]
> |分支|用途|
> |---|---|
> |content(master)|存储所有文稿内容，以及公众号内容抓取脚本|
> |[vitepress](https://github.com/ktKongTong/btnews/tree/vitepress)|当前 master 分支对应的部署分支，部署时会远程载入 master 分支的内容。将站点框架与内容解耦，以期望进一步方便自定义UI及框架迁移，比如你可以 fork master分支并用wiki.js 建造自己的存档站|
> |[vuepress](https://github.com/ktKongTong/btnews/tree/vuepress)|原 master 分支，内容与 vuepress 以及抓取脚本耦合，其内容不会再更新，所有内容更新都位于当前 master 分支|

### 仓库结构
```
├── .github (用于 抓取脚本的 github action)
├── docs [存储文档内容]
│   ├── btnews [睡前消息编辑部内容]
│   │   ├── btnews   [睡前消息主线]
│   │   │   ├── 0001_0100   [睡前消息主线 1~100期]
│   │   │   │   ├── btnews_0001.md [睡前消息第1期]
│   │   │   │   ├── btnews_0002.md [睡前消息第2期]
│   │   │   │   ├── ...
│   │   │   ├── 0201_0200   [睡前消息主线 101~200期]
│   │   │   ├── ...
│   │   ├── refnews  [参考信息]
│   │   ├── opinion  [高见]
│   │   ├── commercial [讲点黑话]
│   │   ├── ...
│   ├── (namespace name) 
├── images [存储图片内容]
│   ├── btnews [睡前消息编辑部内容]
│   │   ├── btnews   [睡前消息主线]
│   │   │   ├── 0001_0100   [睡前消息 1~100期]
│   │   │   │   ├── 0001 [睡前消息主线 第1期 图片]
│   │   │   │   │   ├── xxx.webp
│   │   │   │   │   ├── ...
│   │   │   │   ├── 0002 [睡前消息主线 第2期 图片]
│   │   │   │   ├── ...
├── script [抓取脚本]
└── .gitignore
├── package.json [脚本相关]
├── package-lock.json [脚本相关]
└── tsconfig.json [脚本相关]
```

### docs 文件夹内容
docs 文件夹下存储所有文档内容， 但是为了便于查找/索引内容，分为三层结构
```
├── namsepace
│   ├── category
│   │   ├── indexrange
│   │   ├── ├── index
```
namespace 标明一个主体，比如睡前消息工作室，其产出的所有栏目如讲点黑话、高见、睡前消息、参考信息均在该 namespace 下。
category 标明 namespace 下的一个栏目，如讲点黑话、高见
indexrange 标明当前栏目的索引号范围，如 0001_0100
index 对应具体某一期的内容

### images 文件夹内容
与docs 文件夹结构类似。唯一区别在于 index 作为一个文件夹存在，存储对应文稿的所有图片。
