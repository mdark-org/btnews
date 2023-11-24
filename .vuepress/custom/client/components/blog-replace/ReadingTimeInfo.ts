import type { PropType, VNode } from "vue";
import { computed, defineComponent, h } from "vue";
import type {
  ReadingTime,
  ReadingTimeLocale,
} from "vuepress-plugin-reading-time2/client";

import { TimerIcon } from "vuepress-theme-hope/modules/info/components/icons";
import { useMetaLocale } from "vuepress-theme-hope/modules/info/composables/index";

export default defineComponent({
  name: "ReadingTimeInfo",

  inheritAttrs: false,

  props: {
    /**
     * Reading time information
     *
     * 阅读时间信息
     */
    readingTime: {
      type: Object as PropType<ReadingTime | null>,
      default: () => null,
    },

    /**
     * Reading time locale
     *
     * 阅读时间语言环境
     */
    readingTimeLocale: {
      type: Object as PropType<ReadingTimeLocale | null>,
      default: () => null,
    },

    /**
     * Whether in pure mode
     *
     * 是否处于纯净模式
     */
    pure: Boolean,
  },

  setup(props) {
    const metaLocale = useMetaLocale();

    const readingTimeMeta = computed(() => {
      if (!props.readingTime) return null;
      const { words, } = props.readingTime;
      return `${words} 字`;
    });
    const words = computed(() => {
        if (!readingTimeMeta) return ``;
        return readingTimeMeta.value;
    });
    return (): VNode | null =>
        words.value
        ? h(
            "span",
            {
              class: "page-reading-time-info",
              "aria-label": `字数`,
              ...(props.pure ? {} : { "data-balloon-pos": "down" }),
            },
            [
              h(TimerIcon),
              h("span", words.value),
              h("meta", {
                property: "wordCount",
                content: words.value,
              }),
            ],
          )
        : null;
  },
});