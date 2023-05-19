<template>
    <div :style="actKey !== activeKey ? {display:'none'}:{}">
      <slot></slot>
    </div>
  </template>
  <script>
  import { ref, inject } from "vue";
  export default {
    props: {
      actKey: {
        type: String,
        default: "1",
      },
      label: {
        type: String,
        default: "全部",
      },
    },
  
    setup(props) {
      let activeKey = ref();
      activeKey = inject("activeKey");
      return { activeKey };
    },
  };
  </script>