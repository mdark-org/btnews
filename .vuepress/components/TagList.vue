<script setup>
// import { RouterLink } from "vue-router";
// import { type BlogPluginCategoryFrontmatter } from "vuepress-plugin-blog2";
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
console.log(tagsArr)
</script>
<template>

    <div class="tag-list-wrapper">
            <div class="tag-list-content">
                <div class="tag-list-item" v-for="tag in tagsArr" :key="tag.key">
                    <RouterLink :to="tag.path">{{ tag.key }}({{ tag.count }})</RouterLink>
                </div>
        </div>
    </div>
</template>

<style scoped>
.tag-list-wrapper{
    /* overflow: hidden; */
    max-height: 20rem;
}

.tag-list-content{
    max-height: 20rem;
  margin: 5px auto;
  display: flex;
  flex-wrap: wrap;
  outline: 10px var(--bg-color-light);
}
.tag-list-item{
    border: 1px solid var(--border-color);
    background-color: var(--bg-color-light);
    border-radius: 5px;
    padding: 0.2rem;
    margin: 0.2rem;
    text-align: center;
    cursor: pointer;
}
</style>