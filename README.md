# btnews
这是一个睡前消息文稿的存档仓库

[在线查看](https://mdark.org/docs/btnews/index)

[rss](https://mdark.org/rss/btnews)

最初该仓库是作为睡前消息文稿内容的存档仓库存在的，后续更新引入其他栏目内容。

master 分支仅存储文稿内容以及文稿抓取脚本。
### clone
如果你需要 clone 该仓库并提交内容，请务必使用 单分支 clone，大小约为 1G（images 文件），全量 clone 过大 4g（优化中）
```
git clone -b master --single-branch https://github.com/mdark-org/btnews
```


### 2025

主分支移除所有文档框架，仅当作纯文档仓库。作为 MDARK 的一部分。
详见 [https://github.com/mdark-org](https://github.com/mdark-org)
每日利用 github action 定时抓取 UP 更新视频。

### 2024.12.20

随着睡前消息恢复更新，该存档仓库也同步恢复更新。 

由于睡前消息公众号文稿更新缓慢，且部分栏目无文稿更新，因此原公众号抓取脚本不再适用。

目前更新流程如下：
1. 定时/主动触发 github action
2. github action 自动抓取视频信息，获取需要生成视频
3. 下载视频内容、通过 ffmpeg 转为 mp3
4. 调用 dify 工作流，转为最终文稿
   4.1 输入音频文件，调用 speech2text 模型(whisper)，生成文本
   4.2 通过 LLM 将 speech2text 内容进行处理，添加标点符号、分段、标注广告段落，产出最终结果
5. 自动提交 PR
6. 人工核对 PR，修正识别错误并合并。

该流程存在的问题
1. 相比于其他成熟语音识别API，识别准确度可能不够，90%+
2. 内容存在疏漏，平均每篇内容中有1～2处（50～100字)遗漏、被 speech2text 模型直接忽略。
3. 人工核对较慢

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
