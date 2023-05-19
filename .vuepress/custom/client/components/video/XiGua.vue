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
    const src = `https://www.ixigua.com/iframe/${id}?autoplay=0&startTime=${start}`
</script>
<template>
    <iframe 
    :src="src"
    frameborder="0" allowfullscreen 
     referrerpolicy="unsafe-url">
    </iframe>
</template>