<template>
    <HopeNormalLayout :key="prop.key">
        <template #contentBefore>
            <div class="theme-hope-content custom-content-before">
                <Video/>
            </div>
        </template>
    </HopeNormalLayout>
</template>
<script setup lang="ts">
import HopeNormalLayout from 'vuepress-theme-hope/components/NormalPage'
import Video from "../components/video/Video.vue";
const prop = defineProps<{
    key: string;
}>()
</script>

<style lang="scss">
.custom-content-before {
    padding-bottom: 0 !important;
}
</style>