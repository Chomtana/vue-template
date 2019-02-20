import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import _ from 'lodash'
import $ from 'jquery'

function newArray(row,col,val) {
  var res = [];
  for(var i = 0;i<row;i++) {
    var subres = [];
    for (var j = 0;j<col;j++) {
      if (typeof val == "object") {
        val._row = i;
        val._col = j;
      }
      subres.push(_.cloneDeep(val))
    }
    res.push(subres);
  }
  return res;
}

function giveItem(itemName) {
  if (!store.state.player.inventory[itemName]) store.state.player.inventory[itemName] = 0;
  store.state.player.inventory[itemName]++;
  console.log("giveItem "+itemName)
}

function giveItemFunc(itemName) {
  return function() {
    giveItem(itemName);
  }
}

function revealItem(itemName,prop) {
  if (prop == 0) return;
  var x = Math.random();
  if (x<=prop) {
    console.log("Reveal "+itemName);
  }
}

export default function () {
  if (!window.store) {
    Vue.use(Vuex)

    window.store = new Vuex.Store({
      //Note: Top level of state is fixed, add property can lead to bug.
      //Current flexibility level require you to intialize all global state name before.
      //(but it can has value of null or undefined)
      state: {
        blocks: newArray(10, 50 , {
          digged: false,
          hp: 5,
          maxHp: 5,
          armor: 0,
          onCollide: function(target) {
            this.decreaseHp();
            //console.log(store.state.player.bound.prog.top + store.state.player.bound.prog.height , $("#block-"+this._row+"-"+this._col).position().top)
            if (this.hp>0 /*&& store.state.player.bound.prog.top + store.state.player.bound.prog.height > $("#block-"+this._row+"-"+this._col).position().top*/) {
              //console.log("#block-"+this._row+"-"+this._col)
              store.commit("rejectPos",[store.state.player,{
                //top: $("#block-"+this._row+"-"+this._col).position().top - store.state.player.bound.prog.height
              }])
            } else {
              if (!this.digged) {
                this.onDigged();
              }
              this.digged = true;
            }
          },
          decreaseHp: function() {
            if (this.hp > 0) {
              this.hp -= Math.max(store.state.player.drill.damage - this.armor,0);
              this.hp = Math.max(this.hp,0)
            } else {
              if (!this.digged) {
                this.digged = true;
                this.onDigged();
              }
            }
          },
          onDigged: () => {
            giveItem("grass");
            revealItem("stone",0.75);
          },
          texture: 'url(https://c1.staticflickr.com/4/3516/3811405243_70511d8797_b.jpg)'
        }),
        items: newArray(10, 50, []),
        blockWidth: 50,
        blockHeight: 50,
        player: {
          bound: {
            prog: {
              top: -40.1,
              left: 1000,
              width: 30,
              height: 30
            },
            real: {
              top: -40.1,
              left: 1000,
              width: 30,
              height: 30
            }
          },
          horizontalSpeed: 5,
          verticalSpeed: 5,
          drill: {
            damage: 0.5
          },
          inventory: {
            
          },
          onCollide: function(target) {
            console.log(target)
          }
        },
        camera: {
          top: 0,
          left: -20
        },
        playableWidth: 500,
        playableHeight: 500,
        items_info: {
          grass: {
            weight: 1,
            value: 1
          },
          stone: {
            weight: 5,
            value: 20,
            texture: 'url(http://pluspng.com/img-png/png-stone-stone-png-1024.png)'
          }
        }
      },
      mutations: {
        moveHorizontal: _.throttle((state, target) => {
          TweenLite.to(target[0].bound.prog, 1/100, {left: target[0].bound.prog.left + target[1]});
        }, 10),
        moveVertical: _.throttle((state, target) => {
          TweenLite.to(target[0].bound.prog, 1/100, {top: target[0].bound.prog.top + target[1]});
        }, 10),
        acceptPos(state,target) {
          target.bound.real = _.cloneDeep(target.bound.prog)
          if (target == store.state.player) {
            store.state.camera.left = target.bound.real.left + target.bound.real.width/2
            store.state.camera.top = target.bound.real.top + target.bound.real.height/2
          }
        },
        rejectPos(state,target) {
          if (target.length && target.length==2) {
            let res = _.cloneDeep(target[0].bound.real)
            for(let x in target[1]) {
              res[x] = target[1][x];
            }
            target[0].bound.prog = res;
            return;
          }
          target.bound.prog = _.cloneDeep(target.bound.real)
        }
      },
      getters: {

      }
    })

    //console.log(Vue.store.state);

    Vue.mixin({
      computed: (function(){
        var res = {};
        for(let x in window.store.state) {
          res[x] = {
            get: ()=>window.store.state[x],
            set: (val)=>window.store.state[x] = val
          }
        }
        
        for(let x in window.store.getters) {
          res[x] = ()=>window.store.getters[x]
        }
        
        //console.log(res)
        
        return res;
      })(),
      methods: (function() {
        var keys = [];
        for(let x in window.store._mutations) {
          keys.push(x)
        }
        var res = mapMutations(keys);
        return res;
      })()
    });
    
    var movingHorizontal = 0;
    var movingVertical = 0;
    
    $(window).keydown(function(event) {
      if(event.which==37) {
        movingHorizontal = -store.state.player.horizontalSpeed;
      } else if (event.which==39) {
        movingHorizontal = store.state.player.horizontalSpeed;
      } else if (event.which==38) {
        movingVertical = -store.state.player.verticalSpeed;
      } else if (event.which==40) {
        movingVertical = store.state.player.verticalSpeed;
      }
    })
    
    $(window).keyup(function(event) {
      if(event.which==37) {
        movingHorizontal = 0;
      } else if (event.which==39) {
        movingHorizontal = 0;
      } else if (event.which==38) {
        movingVertical = 0;
      } else if (event.which==40) {
        movingVertical = 0;
      }
    })
    
    function calblock(bound) {
      return [
        Math.floor((bound.top+bound.height-0.01)/store.state.blockHeight),
        Math.floor((bound.left+bound.width/2)/store.state.blockWidth)
      ]
    }
    
    function jqueryBound(ele) {
      if (!ele.length || (ele.length && ele.length==0)) return null;
      var res = ele.position();
      res.width = ele.width();
      res.height = ele.height();
      return res;
    }
    
    function checkCollide(boundA,boundB) {
      //console.log(boundB.left,boundA.left + boundA.width)
      return (
        (
          ((boundA.left < boundB.left) && (boundB.left < boundA.left + boundA.width)) ||
          ((boundA.left < boundB.left + boundB.width) && (boundB.left + boundB.width < boundA.left + boundA.width))
        ) && (
          ((boundA.top < boundB.top) && (boundB.top < boundA.top + boundA.height)) ||
          ((boundA.top < boundB.top + boundB.height) && (boundB.top + boundB.height < boundA.top + boundA.height))
        )
      ) || (
        (
          ((boundB.left < boundA.left) && (boundA.left < boundB.left + boundB.width)) ||
          ((boundB.left < boundA.left + boundA.width) && (boundA.left + boundA.width < boundB.left + boundB.width))
        ) && (
          ((boundB.top < boundA.top) && (boundA.top < boundB.top + boundB.height)) ||
          ((boundB.top < boundA.top + boundA.height) && (boundA.top + boundA.height < boundB.top + boundB.height))
        )
      )
    }
    
    
    setInterval(function() {
      //Player
      store.commit("moveHorizontal",[store.state.player,movingHorizontal])
      store.commit("moveVertical",[store.state.player,movingVertical])
      if (store.state.player.bound.prog.top + store.state.player.bound.prog.height < -0.11) {
        store.commit("rejectPos",[store.state.player,{
          top: -store.state.player.bound.prog.height - 0.1
        }])
      }
      //console.log(movingHorizontal,movingVertical);
    
      //console.log(calblock(store.state.player.bound.prog));
    
      //Check collide
      var playerBlock = calblock(store.state.player.bound.prog)
      for(var i = -1;i<=1;i++) {
        for (var j = -1;j<=1;j++) {
          var blockBound = jqueryBound($('#block-'+(playerBlock[0]+i)+'-'+(playerBlock[1]+j)))
          //console.log('#block-'+(playerBlock[0]+i)+'-'+(playerBlock[1]+j))
          if (blockBound) {
            if (checkCollide(store.state.player.bound.prog,blockBound)) {              
              store.state.blocks[playerBlock[0]+i][playerBlock[1]+j].onCollide(store.state.player)
            }
          }
        }
      }
      /*if (playerBlock[0] >= 0) {
        store.state.blocks[playerBlock[0]][playerBlock[1]].onCollide(store.state.player)
      }*/
      
      store.commit("acceptPos",store.state.player)
    },10);
  }
}