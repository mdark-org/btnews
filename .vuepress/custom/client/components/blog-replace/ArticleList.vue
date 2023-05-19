<script setup>
import HomeCardItem from '../HomeCardItem.vue';
const {key, items} = defineProps({
    key: String,
    items: Array
})

</script>
<template>
    <HomeCardItem
        v-for="item in items"
        :key="item.path"
        :title="item.info.t"
        :description="item.info.e"
        :date="new Date(item.info.d).toLocaleString()"
        :tags="item.info.g"
        :link="item.path"
    ></HomeCardItem>
</template>