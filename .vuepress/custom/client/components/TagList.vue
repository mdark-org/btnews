
<!-- 从 List 变成 TagSearcher -->
<!-- Tag -->
<script setup>
import Tag from "./Tag.vue";
import { useTagMap } from "@theme-hope/modules/blog/composables/index";

const tags = useTagMap();
const tagMap = tags.value.map;
let tagsArr = Object.keys(tagMap).map((key) => {
    let value = tagMap[key];
    let res = {
        key: key,
        path: value.path,
        count: value.items.length
    }
    return res;
})
tagsArr.sort((a, b) => {
    return b.count - a.count;
})
import { usePageFrontmatter } from "@vuepress/client"
const pageFrontmatter = usePageFrontmatter();
const isActive= (name) => {
    return pageFrontmatter.value.blog?.name === name
}

// 获取当前 tag,如果tag为指定 tag, ArticleList,只显示单个 tag

</script>
<template>

    <div class="tag-list-wrapper">
            <div class="tag-list-content">
                <Tag v-for="tag in tagsArr" :tag="tag.key" :key="tag.key" :count="tag.count" :active="isActive(tag.key)" class="tag-item"></Tag>
        </div>
    </div>
</template>

<style scoped>
.tag-list-wrapper{
    overflow: hidden;
}

.tag-list-content{
  margin: 5px auto;
  display: flex;
    overflow-x: auto;
    overflow-y: auto;
  flex-wrap: wrap;
}
.tag-item{
    /* border: 1px solid var(--border-color);
    background-color: var(--bg-color-light); */
    border-radius: 5px;
    padding: 0.2rem 0.3rem;
    margin: 0.2rem 0.2rem;
    text-align: center;
    cursor: pointer;
}
</style>