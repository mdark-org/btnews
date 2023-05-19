<script setup lang="ts">
import Tag from './Tag.vue';
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

// yyyy-mm-dd weekday
let dateFormat = new Date(date)
let dateFormated = dateFormat.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })


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
            <Tag v-for="tag in tags" :key="tag" :tag="tag" class="tag-item"/>
        </div>
        </div>
        <div class="card-item-description text-overflow" v-html="description">
        </div>
    </div>
</template>
<style scoped lang="scss">
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
.card-item-description > figure{
    display: flex !important;
    flex-direction: column !important;
}


.card-item-tags{
    margin: 0.1rem 1rem;
    display: flex;
    flex-wrap: wrap;
 }
 .tag-item{
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
 }
</style>