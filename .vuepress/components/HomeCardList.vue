<script setup lang="ts">
import { type BasePageFrontMatter } from "vuepress-shared";
interface PageFrontmatter extends BasePageFrontMatter {
    recentPage: Array<any>;
}
import { usePageFrontmatter } from '@vuepress/client'
import HomeCardItem from "./HomeCardItem.vue";
const frontmatter = usePageFrontmatter<PageFrontmatter>();
const recentPage = frontmatter.value.recentPage;
</script>
<template>
    <div class="home-card">
            <HomeCardItem :title="page.title" :description="page.description" :tags="page.tag" :link="page.link" :date="page.date"  v-for="page in recentPage" :key="page.data"/>
    </div>
    <div>
        <RouterLink to="/btnews/idx" style="margin-right: 20px;margin-left: auto; display: flex;justify-content:end">All Posts</RouterLink>
    </div>

</template>

<style scoped>
.home-card{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 1.5rem;
    padding-bottom: 2rem;
}
</style>