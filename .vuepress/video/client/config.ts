import { defineClientConfig } from '@vuepress/client'
import VideoService from './VideoService.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('VideoService', VideoService)
  },
})