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
          <template v-for="(blockRow,row) in items">
            <template v-for="(block,col) in blockRow">
              <div v-if="block.length==0" :key="col+' '+row" :style="{
                width: blockWidth+'px',
                height: blockHeight+'px',
                'background': 'transparent',
                'text-align': 'center',
                'border': '1px solid'
              }" :id="'item-block-'+row+'-'+col" class="item-block">
                
              </div>
              <template v-if="block.length>0">
                <div v-for="item in block" :key="col+' '+row+' '+item.name" :style="{
                  width: blockWidth+'px',
                  height: blockHeight+'px',
                  'background': (item.texture?item.texture:'transparent'),
                  'text-align': 'center',
                  'border': '1px solid'
                }" :id="'item-block-'+row+'-'+col" class="item-block">
                  
                </div>
              </template>
            </template>
          </template>
        </div>
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
              
            </div>
          </template>
        </div>
      </CamLayer>
      <CamLayer :class="['npc']" :id="'npc-'+npc_id" v-for="(npc,npc_id) in npcs" :key="npc_id"  :top="npc.bound.real.top" :left="npc.bound.real.left" :width="npc.bound.real.width" :height="npc.bound.real.height"
        :style="{
          'background-image': 'url('+npc.img+')',
          'display': (npc.show?'block':'none')
        }"
      >
        
      </CamLayer>
      <Player />
    </LayerContainer>
    
    <b-modal id="inventory-modal" title="Inventory" ok-only>
      <div v-for="(item,itemName) in player.inventory" :key="itemName">
        {{item}}x {{items_info[itemName].title}}  
      </div>
      <div>
        <b>Total weight: </b> {{playerTotalWeight()}}
      </div>
    </b-modal>
    <b-button v-b-modal.inventory-modal>Inventory</b-button>
    
    <b-modal id="quests-modal" title="Quests" ok-only>
      <input type="checkbox" v-model="showCompletedQuests"> Show completed quests
      <div v-for="(quest,i) in quests" :key="i">
        <b-card :title="quest.title" v-if="quest.inprogress()" :class="['mb-3',(quest.isCompleted() && !showCompletedQuests?'d-none':'')]"
          :style='{
            "background-color": (quest.isCompleted()?"greenyellow":"yellow")
          }'
        >
          <div class="mb-2">
            {{quest.description}}
          </div>
          <div>
            {{quest.isCompleted() ? "Completed" : "In Progress"}}  
          </div>
        </b-card>
        
      </div>
    </b-modal>
    <b-button v-b-modal.quests-modal>Quests</b-button>
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
      msg: 'Welcome to Your Vue.js App dasdasdasdasd',
      showCompletedQuests: true
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
  },
  mounted() {
    setInterval(() => {
      for(let quest of this.quests) {
        if (quest.inprogress() && !quest.milestone) {
          //console.log("asasa");
          quest.milestone = _.cloneDeep(this.milestone);
        }
      }
    },100)
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

.npc {
  background-color: green;
  background-size: 100% 100%;
  background-repeat: none;
  
}

.block, .item-block {
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  
}
</style>
