import { defineClientConfig } from '@vuepress/client'
import type { CloudflareAnalyticsPluginOptions } from '../shared'
import { useCloudflareAnalytics } from './composables'

declare const __GA_OPTIONS__: CloudflareAnalyticsPluginOptions

const options = __GA_OPTIONS__

export default defineClientConfig({
    enhance() {
        if (__VUEPRESS_SSR__) return
        useCloudflareAnalytics(options)
    },
})