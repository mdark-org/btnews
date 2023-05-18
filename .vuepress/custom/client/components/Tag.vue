<script setup lang="ts">
const {tag} = defineProps({
    tag: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: false,
        default: 0
    }
})
import { useRouter } from "vue-router"
const router = useRouter()
const clickTag = (tag: string) => {
    router.push("/tag/"+tag)
}
</script>
<template>
<span class="tag" @click="clickTag(tag)">{{ count > 0 ? `${tag} ${count}` : tag }}</span>
</template>
<style scoped>
.tag{
    margin: 0.2rem 0.2rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    background-color: var(--border-color-light);
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    cursor: pointer;
}
.tag:hover{
    background-color: var(--bg-color-light);
    color: var(--theme-color);
}
</style>