import type { CloudflareAnalyticsPluginOptions } from '../../shared'

declare const dataLayer: any[]
declare const gtag: (...args: any[]) => void

declare global {
    interface Window {
        dataLayer?: typeof dataLayer
        gtag?: typeof gtag
    }
}

export const useCloudflareAnalytics = (
    options: CloudflareAnalyticsPluginOptions
): void => {
    // avoid duplicated import
    if (window.dataLayer && window.gtag) {
        return
    }
    const gtagScript = document.createElement('script')
    gtagScript.src = `https://static.cloudflareinsights.com/beacon.min.js`
    gtagScript.defer = true
    gtagScript.setAttribute("data-cf-beacon",`{"token":"${options.token}"}`)
    // console.log(gtagScript)
    document.head.appendChild(gtagScript)
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
        dataLayer.push(arguments)
    }

    gtag('js', new Date())

    if (options.debug) {
        gtag('config', options.token, { debug_mode: true })
    } else {
        gtag('config', options.token)
    }
}