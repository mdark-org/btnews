<script lang="ts" setup>

import {
    usePageData,
    usePageFrontmatter,
    usePageLang,
    withBase,
  } from "@vuepress/client";
  import { pageviewCount } from "@waline/client/dist/pageview.mjs";
  import {
    computed,
    defineAsyncComponent,
    nextTick,
    onMounted,
    watch,
  } from "vue";
  import { LoadingIcon, useLocaleConfig } from "vuepress-shared/client";

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
      let abort: () => void;
      let enableWaline = Boolean(walineOptions.serverURL);

      const enablePageViews = computed(() => {
        if (!enableWaline) return false;
        const pluginConfig = walineOptions.pageview !== false;
        const pageConfig = frontmatter.value.pageview;
  
        return (
          Boolean(pageConfig) ||
          (pluginConfig !== false && pageConfig !== false)
        );
      });

      const walineKey = computed(() => {
        if (page.value.frontmatter.idx) {
          return withBase(`/btnews/idx/${page.value.frontmatter.idx}/`);
        }
        enableWaline = false;
        // console.log(false)
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
      const WalineComponent = defineAsyncComponent({
        loader: async () =>(await import("@waline/client/dist/component.mjs")).Waline,
        loadingComponent: LoadingIcon,
    })
</script>

<template>
    <div v-if="enableWaline" class="waline-wrapper" id="comment">
        <ClientOnly>
            <!-- <div>hello</div> -->
            <WalineComponent :serverURL="walineProps.serverURL" :path="walineProps.path" dark="html.dark" lang="zh-CN" />
        </ClientOnly>
    </div>


</template>