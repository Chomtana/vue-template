<template>
  <LayerContainer :width=500 :height=500>
    <Layer>
      <img src="https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/04/jonathan-martin-brunate-lead-image_0.jpg">
    </Layer>
    <Layer :left=50 :top=50 :height=750 style="background-color: red;">
      <img src="http://environment.umn.edu/wp-content/uploads/2016/04/global_landscapes_initiative_directory_pages.jpg">
    </Layer>
  </LayerContainer>
</template>

<script>
import Test from './Test.vue'
import LayerContainer from './component/LayerContainer.vue'
import Layer from './component/Layer.vue'

initGlobal()

export default {
  name: 'app',
  store,
  components: {
    Test, LayerContainer, Layer
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App dasdasdasdasd'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
