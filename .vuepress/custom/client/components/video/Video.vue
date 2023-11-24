<template>
    <TabGroup :defaultKey="0" v-if="videos.length > 0">
        <TabPanel :label="video.provider" :actKey="index" :key="video.provider"   v-for="(video, index)  in videos">
            <div style="position: relative; padding: 30% 45%;">
                <component :key="video.id" :is="providerMap[video.provider]" :id="video.id" start="0" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;border-radius: 10px;" />
            </div>
        </TabPanel>
    </TabGroup>
</template>

<script setup lang="ts">
import Youtube from "./Youtube.vue";
import BiliBili from "./BiliBili.vue";
import XiGua from "./XiGua.vue";
import TabGroup from "./tab/TabGroup.vue";
import TabPanel from "./tab/TabPanel.vue";
import { type BasePageFrontMatter } from "vuepress-shared";
import { usePageFrontmatter } from '@vuepress/client';
import { ref } from "vue";
import {useRouter } from 'vue-router'
interface PageFrontmatter extends BasePageFrontMatter {
    xgid?: string;
    bvid?: string;
    ytid?: string;
}

const router = useRouter();
const providerMap = {
"Bilibili": BiliBili,
"bilibili": BiliBili,
"Youtube": Youtube,
"youtube": Youtube,
"XiGua": XiGua,
"xigua": XiGua,
}


const getVideo = () => {
    const frontmatter = usePageFrontmatter<PageFrontmatter>();
    return [
        {
            provider: 'xigua',
            id: frontmatter.value.xgid
        },
        {
            provider: 'bilibili',
            id: frontmatter.value.bvid
        },
        {
            provider: 'youtube',
            id: frontmatter.value.ytid
        }].filter((video) => {
            return video.id !== '' && video.id !== undefined && video.id !== null;
        })
}
const videos = ref(getVideo())
router.afterEach(() => {
    videos.value = getVideo()
})
</script>
<style scoped></style>