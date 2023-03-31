import type { Plugin, PluginObject } from '@vuepress/core'
import { getDirname, logger, path } from '@vuepress/utils'
import type { CloudflareAnalyticsPluginOptions } from '../shared'

// @ts-ignore
const __dirname = getDirname(import.meta.url)

export const cloudflareAnalyticsPlugin =
    (options: CloudflareAnalyticsPluginOptions): Plugin =>
        (app) => {
            const plugin: PluginObject = {
                name: 'plugin-cloudflare-analytics',
            }

            if (!options.token) {
                logger.warn(`[${plugin.name}] 'token' is required`)
                return plugin
            }

            // returns an empty plugin in dev mode when debug mode is not enabled
            if (app.env.isDev && !options.debug) {
                return plugin
            }

            return {
                ...plugin,

                clientConfigFile: path.resolve(__dirname, '../client/config.ts'),

                define: {
                    __GA_OPTIONS__: options,
                },
            }
        }