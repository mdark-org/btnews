<script setup lang="ts">
const {tag,count,active} = defineProps({
    tag: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: false,
        default: 0
    },
    active : {
        type: Boolean,
        required: false,
        default: false
    }
})
import { useRouter } from "vue-router"

const router = useRouter()


const clickTag = (tag: string) => {
    if (!active) {
        router.push("/tag/"+tag)
    }
}
</script>
<template>
    <span :class="`tag ${active ? 'active':''}`" @click="clickTag(tag)">{{ count > 0 ? `${tag} ${count}` : tag }}</span>
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
.active {
    background-color: var(--bg-color-light);
    color: var(--theme-color);
}
.tag:hover{
    background-color: var(--bg-color-light);
    color: var(--theme-color);
}
</style>