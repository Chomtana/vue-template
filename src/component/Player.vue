<template>
  <CamLayer class="player moveable" :top="player.bound.real.top" :left="player.bound.real.left" :width="player.bound.real.width" :height="player.bound.real.height">
    
  </CamLayer>
</template>

<script>
import LayerContainer from './LayerContainer.vue'
import Layer from './Layer.vue'
import CamLayer from './CamLayer.vue'

initGlobal()

export default {
  name: 'app',
  store,
  components: {
    LayerContainer, Layer, CamLayer
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App dasdasdasdasd'
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    background-color: red;
  }
</style>

