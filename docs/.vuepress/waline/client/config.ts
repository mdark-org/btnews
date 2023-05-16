import { defineClientConfig } from '@vuepress/client'
import CommentService from './CommentService.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('CommentService', CommentService)
  },
})