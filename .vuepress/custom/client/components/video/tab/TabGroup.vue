<template>
    <div class="tab-group">
      <div ref="barRef" class="tab-bar" :style="{ width: widthRef + 'px' }"></div>
      <div ref="titsRef" class="tab-header" layout="row" layout-wrap>
        <div
          ref="titRef"
          :class="[{ active: activeKey == item.props.actKey }, 'tab-nav']"
          v-for="(item, index) in tabTitLists"
          :key="item"
          @click="onTabClick($event, item, index)"
        >
          {{ item.props.label }}
        </div>
      </div>
      <div class="tab-panel">
        <slot></slot>
      </div>
    </div>
  </template>
  <script>
  import { ref, onMounted, provide } from "vue";
  export default {
    props: {
      defaultKey: {
        type: String,
        default: "1",
      },
    },
    setup(props, context) {
      const tabTitLists = context.slots.default()[0].children;
      let activeKey = ref(props.defaultKey);
      provide("activeKey", activeKey);
      const barRef = ref(null);
      const titRef = ref(null);
      let widthRef = ref();
      onMounted(() => {
        widthRef.value = titRef.value.clientWidth;
      });
      function onTabClick(event, tab, index) {
        activeKey.value = tab.props.actKey;
      }
      return {
        tabTitLists,
        barRef,
        titRef,
        widthRef,
        onTabClick,
        activeKey,
      };
    },
  };
  </script>
  <style>
 .tab-group .tab-header:after {
	 content: "";
	 width: 100%;
	 border-bottom: 2px solid #ddd;
}
 .tab-group .tab-nav {
     font-weight: 500;
	 line-height: 40px;
	 display: inline-block;
	 margin-right: 2em;
	 cursor: pointer;
	 border-bottom: 2px solid transparent;
}
 .tab-group .tab-nav.active {
	 color: var(--theme-color);
	 border-bottom-color: var(--theme-color);
}
 .tab-group .tab-panel {
	 padding: 10px;
}
  </style>