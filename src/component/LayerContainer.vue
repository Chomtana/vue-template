<template>
  <div class="layer-con" :style='{
    overflow: (!overflow?"hidden":(overflow===true?"":overflow)) ,
    width: typeof width=="string" ? width : width+"px",
    height: typeof height=="string" ? height : height+"px"
  }'>
    <slot></slot>
  </div>
</template>

<script>
initGlobal()

export default {
  store,
  props: {
    overflow: {
      type: [Boolean, String],
      default: false
    },
    width: {type: [Number,String], default: "auto"},
    height: {type: [Number,String], default: "auto"}
  }
}
</script>

<style>
  .layer-con {
    position: relative;
    overflow: hidden;
  }
</style>