<template>
  <div class="layer" :style='{
    left: left+"px",
    top: top+"px",
    width: typeof width=="string" ? width : width+"px",
    height: typeof height=="string" ? height : height+"px"
  }'>
    <slot></slot>
  </div>
</template>

<script>
  initGlobal();

  export default {
    store,
    props: {
      left: {type: Number, default: 0},
      top: {type: Number, default: 0},
      width: {type: [Number,String], default: "auto"},
      height: {type: [Number,String], default: "auto"}
    }
  }
</script>

<style>
  .layer {
    position: absolute;
  }
</style>