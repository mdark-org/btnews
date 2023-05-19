<script setup lang="ts">
import Youtube from "./Youtube.vue";
import BiliBili from "./BiliBili.vue";
import TabGroup from "./TabGroup.vue";
import TabPanel from "./TabPanel.vue";
import { type PropType } from 'vue';
type Provider ="Bilibili" | "Youtube"
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

let videoProviders: Array<Provider> = []
if (typeof provider === "string") {
    videoProviders = [provider]
}else{
    videoProviders = provider as unknown as Array<Provider>
}
let videoIds:Array<string> = []
if (typeof videoId === "string") {
    videoIds = [videoId]
}else{
    videoIds = videoId as unknown  as Array<string>
}

const videoIdMap = new Map<Provider, string>()
videoProviders.forEach((provider, index) => {
    videoIdMap.set(provider, videoIds[index])
})

const getComponent = (provider: Provider) => {
    switch (provider) {
        case "Bilibili":
            return BiliBili
        case "Youtube":
            return Youtube
        default:
            return BiliBili
    }
}
</script>

<template>
    <div class="player-wrapper" id="player">
        <ClientOnly>
            <TabGroup :defaultKey="videoProviders[0]" v-if="videoProviders.length > 1">
                    <TabPanel :label="provider" :actKey="provider" :key="index"   v-for="(provider, index)  in videoProviders">
                        <div style="position: relative; padding: 30% 45%;">
                            <component :is="getComponent(provider)" :id="videoIdMap.get(provider)" start="0" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;border-radius: 10px;" />
                        </div>
                        </TabPanel>
             </TabGroup>
             <div style="position: relative; padding: 30% 45%;" v-else>
                <component :is="getComponent(videoProviders[0])" :id="videoIdMap.get(videoProviders[0])" start="0" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;border-radius: 10px;" />
            </div>
        </ClientOnly>
    </div>
</template>