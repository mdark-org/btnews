import { defineClientConfig } from '@vuepress/client'
import CommentService from './CommentService'

export default defineClientConfig({
  enhance({ app }) {
    app.component('CommentService', CommentService)
  },
})