<script setup lang="ts">
import Tag from './Tag.vue';
// import { type PageTag } from "@theme-hope/modules/info/utils/index";
// import { type PropType } from "vue";
const {tag} = defineProps({
    tag: {
      type: Array,
      default: () => [],
    },
})
</script>
<template>
    <div>
        <Tag v-for="tagItem in tag" :key="tagItem.name" :tag="tagItem.name"></Tag>
    </div>
</template>