<script setup>
import TagList from './TagList.vue';
import {useRoute}   from 'vue-router';
import {computed} from 'vue';
// 获取当前 tag,如果tag为指定 tag, ArticleList,只显示单个 tag
const route = useRoute();
const ok = computed(() => {
    return ['/tag/','/tag'].includes(route.path);
})
const curentTag = computed(() => {
    let rawUrl = route.path.replace('/tag/','').replace('/tag','');
    // if (rawUrl.endsWith('/')) {
    //     rawUrl = rawUrl.slice(0, -1);
    // }
    // URL 反转义
    return decodeURI(rawUrl);
})
// console.log(route.path);
</script>

    <template>
    <div class="tag-list-wrapper">
        <div style="font-weight:bold; font-size: 1.5rem;margin-top:10px;margin-left: 10px; margin-bottom: 20px;">
            <div style="">
                <RouterLink to="/tag">Tags</RouterLink><span v-if="!ok" style=""> {{` / ${curentTag}`}}</span>
            </div>

        
            <Transition name="fade" mode="out-in">
                <TagList v-if="ok"/>
            </Transition>
        </div>

    </div>
</template>
<style scoped>
</style>
