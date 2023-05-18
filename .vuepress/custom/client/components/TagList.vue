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
</script>
<template>

    <div class="tag-list-wrapper">
            <div class="tag-list-content">
                <Tag v-for="tag in tagsArr" :tag="tag.key" :key="tag.key" :count="tag.count" class="tag-item"></Tag>
        </div>
    </div>
</template>

<style scoped>
.tag-list-wrapper{
    overflow: hidden;
    /* max-height: 20rem; */
    margin: 10px;
}

.tag-list-content{
    max-height: 20rem;
  margin: 5px auto;
  display: flex;
  overflow: scroll;
  padding-bottom: 25px;
    padding-top: 20px;
    overflow-x: auto;
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