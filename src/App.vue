<template>
  <div>
    <LayerContainer :width=500 :height=500>
      <CamLayer style="background-image: linear-gradient(to right, cyan , darkblue);" :width="2500" :height="300" :top="-300" :left="0">
        
      </CamLayer>
      <CamLayer style="background-image: linear-gradient(to right, chocolate , saddlebrown);" :width="2500" :height="500" :top="0" :left="0">
        
      </CamLayer>
      <CamLayer>
        <div class="d-flex flex-wrap" :style="{
          width: blocks[0].length*blockWidth+'px'
        }">
          <template v-for="(blockRow,row) in blocks">
            <div v-for="(block,col) in blockRow" :key="col+' '+row" :style="{
              width: blockWidth+'px',
              height: blockHeight+'px',
              'background': (!block.digged?block.texture:'transparent'),
              'text-align': 'center',
              'border': '1px solid',
              'opacity': block.hp/block.maxHp
            }" :id="'block-'+row+'-'+col" class="block">
              {{blocks[row][col].hp}}
            </div>
          </template>
        </div>
      </CamLayer>
      <Player />
    </LayerContainer>
    <b-modal id="inventory-modal" title="Inventory" ok-only>
      <div v-for="(item,itemName) in player.inventory" :key="itemName">
        {{item}}x {{itemName}}  
      </div>
      <div>
        <b>Total weight: </b> {{playerTotalWeight()}}
      </div>
    </b-modal>
    <b-button v-b-modal.inventory-modal>Inventory</b-button>
  </div>
</template>

<script>
import Player from './component/Player.vue'
import LayerContainer from './component/LayerContainer.vue'
import Layer from './component/Layer.vue'
import CamLayer from './component/CamLayer.vue'

initGlobal()

export default {
  name: 'app',
  store,
  components: {
    LayerContainer, Layer, Player, CamLayer
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App dasdasdasdasd'
    }
  },
  methods: {
    playerTotalWeight() {
      var sum = 0;
      for(let itemName in store.state.player.inventory) {
        sum += store.state.items_info[itemName].weight * store.state.player.inventory[itemName];
      }
      return sum;
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

.moveable {
  //transition: 0.1s;
}

.block {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  
}
</style>
