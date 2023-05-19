<script setup lang="ts">
import Youtube from "./Youtube.vue";
import BiliBili from "./BiliBili.vue";
import XiGua from "./XiGua.vue";
import TabGroup from "./tab/TabGroup.vue";
import TabPanel from "./tab/TabPanel.vue";
import { type PropType } from 'vue';

type Provider ="Bilibili" | "Youtube" | "bilibili" | "youtube"
type Video = {
    provider: Provider,
    id: string
}
const providerMap = {
    "Bilibili": BiliBili,
    "bilibili": BiliBili,
    "Youtube": Youtube,
    "youtube": Youtube,
    "XiGua": XiGua,
    "xigua": XiGua,
}
type VideoProvider = Array<Provider> | Provider

const { provider, videoId } = defineProps<{
    provider?: {
        type: PropType<VideoProvider>,
        default: ["Bilibili"]
    },
    videoId: {
        type: Array<string> | string,
            required: true
    },
}>()
let videoIds:Array<string> = []
if (typeof videoId === "string") {
    videoIds = [videoId]
}else{
    videoIds = videoId as unknown  as Array<string>
}

let videoProviders: Array<Provider> = []
if (typeof provider === "string") {
    videoProviders = [provider]
}else{
    videoProviders = (provider as unknown as Array<Provider>)
}

const videoIdMap:Video[] = []
videoProviders.forEach((provider, index) => {
    if (!Object.keys(providerMap).includes(provider)) {
        return
    }
    videoIdMap.push({
        provider: provider, 
        id: videoIds[index]
    })
})
const getComponent = (provider: Provider) => {
    return providerMap[provider]
}
</script>

<template>
    <div class="player-wrapper" id="player">
        <ClientOnly>
            <TabGroup :defaultKey="0" v-if="videoIdMap.length > 1">
                    <TabPanel :label="provider" :actKey="index" :key="index"   v-for="({provider,id}, index)  in videoIdMap">
                        <div style="position: relative; padding: 30% 45%;">
                            <component :is="providerMap[provider]" :id="id" start="0" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;border-radius: 10px;" />
                        </div>
                        </TabPanel>
             </TabGroup>
             <div style="position: relative; padding: 30% 45%;" v-else-if="videoIdMap.length == 1">
                <component :is="getComponent(videoIdMap[0].provider)" :id="videoIdMap[0].id" start="0" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;border-radius: 10px;" />
            </div>
        </ClientOnly>
    </div>
</template>