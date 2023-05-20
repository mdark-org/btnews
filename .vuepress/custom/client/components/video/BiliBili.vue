<script setup lang="ts">
       const { id, start } =  defineProps({
        id: {
            type: String,
            default: ""
        },
        start:{
            type: String,
            default: "0"
        },
    })
    const src = `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0&t=${start}`
</script>
<template>
        <iframe
            :src="src"
            style="background: var(--bg-color);"
            scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true">
        </iframe>
</template>