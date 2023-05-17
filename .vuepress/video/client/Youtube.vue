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
    const src = `https://www.youtube-nocookie.com/embed/${id}?start=${start}`
    console.log(src)
</script>
<template>
        <iframe
            :src="src"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
</template>