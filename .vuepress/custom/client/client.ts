import { defineClientConfig } from '@vuepress/client'
import HomeCardList from './components/HomeCardList.vue'
export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('HomeCardList', HomeCardList)
  },
})