<template>
  <Layer :left="left-camera.left+playableWidth/2" :top="top-camera.top+playableHeight/2" :width="width" :height="height">
    <slot></slot>
  </Layer>
</template>

<script>
import Layer from './Layer.vue'
initGlobal();

export default {
  store,
  mixins: [Layer],
  components: {
    Layer
  },
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