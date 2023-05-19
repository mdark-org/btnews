import { defineClientConfig } from '@vuepress/client'
import HomeCardList from './components/HomeCardList.vue'
import VideoService from './components/video/VideoService.vue'
import CommentService from './components/waline/CommentService.vue'


export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('HomeCardList', HomeCardList)
    app.component('VideoService', VideoService)
    app.component('CommentService', CommentService)
  },
})