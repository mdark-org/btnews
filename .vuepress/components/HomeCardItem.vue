<script setup lang="ts">

const {title, description, tags, link, date} = defineProps({
    title: {
        type: String,
        required: true,
        default: ""
    },
    description:{
        type: String,
        default: ""
    },
    date:{
        type: String,
        required: false,
        default: ""
    },
    tags:{
        type: Array<string>,
        required: false,
        default: []
    },
    link:{
        type: String,
        required: false,
        default: ""
    }
})
import { useRouter } from "vue-router"
const router = useRouter()
const click = () => {
    router.push(link)
}
// yyyy-mm-dd weekday
let dateFormat = new Date(date)
let dateFormated = dateFormat.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const clickTag = (tag: string) => {
    router.push("/tag/"+tag)
}
</script>
<template>
    <div class="card-item">
        <div class="card-item-title text-overflow">
            <RouterLink :to="link">{{ title }}</RouterLink>
        </div>
        <div style="">

        <div class="card-item-date">
            {{ dateFormated }}
        </div>
        <div class="card-item-tags" v-if="tags&&tags.length>0">
            <span v-for="tag in tags" :key="tag" class="card-item-tag" @click="clickTag(tag)">{{ tag }}</span>
        </div>
        </div>
        <div class="card-item-description text-overflow">
            {{ description }}
        </div>
    </div>
</template>
<style scoped>
.card-item{
    border: 1px solid var(--border-color);
    border-radius: 5px;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.card-item:hover{
    border: 1px solid var(--theme-color);
    box-shadow: 0 0 5px var(--theme-color);
}

.text-overflow > a
{
  font-weight: normal;
  color: var(--theme-color);
}
.text-overflow{
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}
.card-item-title{
    margin: 0.5rem 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    -webkit-line-clamp: 2;
  color: var(--theme-color);
}

.card-item-date{
    margin: 0.5rem 1rem;
    cursor:default;
    font-size: 1rem;
}
.card-item-description{
    margin: 0 1rem;
    font-size: 1rem;
    cursor:default;
    -webkit-line-clamp: 8;
}
.card-item-tags{
    margin: 0.1rem 1rem;
    display: flex;
    flex-wrap: wrap;

 }
.card-item-tag{
    margin: 0.2rem 0.2rem;
    max-width: 100px;
    padding: 0.2rem 0.5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 5px;
    background-color: var(--border-color-light);
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    cursor: pointer;
}
.card-item-tag:hover{
    background-color: var(--bg-color-light);
    color: var(--theme-color);
}
</style>