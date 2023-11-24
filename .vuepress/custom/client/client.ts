import { defineClientConfig } from '@vuepress/client'
import HomeCardList from './components/HomeCardList.vue'
import VideoService from './components/video/VideoService.vue'
import HopeLayout from './layouts/HopeLayout';
export default defineClientConfig({
  layouts:{
    Layout: HopeLayout,
  },
  enhance({ app, router, siteData }) {
    app.component('HomeCardList', HomeCardList)
    app.component('VideoService', VideoService)
  },
})