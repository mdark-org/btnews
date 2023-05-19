<script setup >
import TagList from '../TagList.vue';
import {computed} from 'vue';
import { usePageFrontmatter } from "@vuepress/client"
const pageFrontmatter = usePageFrontmatter();
const isTagListPage= computed(()=>{
    return pageFrontmatter.value.blog?.name == null
})

</script>
<template>
<TagList v-if="!isTagListPage"></TagList>
<div v-else class="blank">
   Sorry, blank space
</div>
</template>
<style scoped>
.blank{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: bold;    
    font-size: larger;
}

</style>