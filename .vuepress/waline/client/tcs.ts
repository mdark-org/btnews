import {
  usePageData,
  usePageFrontmatter,
  usePageLang,
  withBase,
} from "@vuepress/client";
import { pageviewCount } from "@waline/client/dist/pageview.mjs";
import {
  type VNode,
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
  nextTick,
  onMounted,
  watch,
} from "vue";
import { LoadingIcon, useLocaleConfig } from "vuepress-shared/client";

// import {
//   type CommentPluginFrontmatter,
//   type WalineLocaleConfig,
// } from "../../shared/index.js";
import { useWalineOptions } from "./comment";

import "@waline/client/dist/waline.css";
import "./styles/waline.scss";

declare const WALINE_META: boolean;
declare const WALINE_LOCALES: any;

const walineLocales = WALINE_LOCALES;

if (WALINE_META)
  import(
    /* webpackChunkName: "waline" */ "@waline/client/dist/waline-meta.css"
  );

export { pageviewCount };

export default defineComponent({
  name: "WalineComment",

  props: {
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: Boolean,
  },
  setup() {
    let walineOptions = useWalineOptions();
    
    if (!walineOptions?.serverURL) {
      walineOptions = {
        serverURL: "https://waline-btnews.vercel.app",
      }
    };


    const page = usePageData();
    const frontmatter = usePageFrontmatter<any>();
    const lang = usePageLang();
    const walineLocale = useLocaleConfig(walineLocales);
    // console.log(walineOptions)
    let abort: () => void;
    let enableWaline = Boolean(walineOptions.serverURL);

    const enablePageViews = computed(() => {
      if (!enableWaline) return false;
      const pluginConfig = walineOptions.pageview !== false;
      const pageConfig = frontmatter.value.pageview;

      return (
        // Enable in page
        Boolean(pageConfig) ||
        // not disabled in anywhere
        (pluginConfig !== false && pageConfig !== false)
      );
    });
    const able = computed(()=>{
      return enableWaline
    })
    const walineKey = computed(() => {
      if (page.value.frontmatter.idx) {
        return withBase(`/btnews/idx/${page.value.frontmatter.idx}/`);
      }
      enableWaline = false;
      return withBase(page.value.path)
    });

    const walineProps = computed(() => ({
      lang: lang.value === "zh-CN" ? "zh-CN" : "en",
      locale: walineLocale.value,
      dark: "html.dark",
      ...walineOptions,
      path: walineKey.value,
    }));

    onMounted(() => {
      watch(
        walineKey,
        () => {
          abort?.();

          if (enablePageViews.value)
            void nextTick().then(() => {
              setTimeout(() => {
                abort = pageviewCount({
                  serverURL: walineOptions.serverURL,
                  path: walineKey.value,
                });
              }, walineOptions.delay || 800);
            });
        },
        { immediate: true }
      );
    });

    return (): VNode | null =>
    able.value
        ? h(
            "div",
            { class: "waline-wrapper", id: "comment",
            style: { display: able.value ? "block" : "none" }, },
            able.value
              ? h(
                h("client-only",{},
                h(defineAsyncComponent({
                    loader: async () =>
                      (
                        await import("@waline/client/dist/component.mjs")
                      ).Waline,
                    loadingComponent: LoadingIcon,
                  }),
                  walineProps.value)
                )
                ) : []
          ) : null;
  },
});