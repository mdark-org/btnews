<script setup>
import Tag from '../Tag.vue';
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