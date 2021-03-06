import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import _ from 'lodash'
import $ from 'jquery'

function newArray(row,col,val,offsetRow,offsetCol) {
  var res = [];
  for(var i = 0;i<row;i++) {
    var subres = [];
    for (var j = 0;j<col;j++) {
      if (typeof val == "object") {
        val._row = i+offsetRow;
        val._col = j+offsetCol;
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
  
  if (!store.state.milestone.inventory[itemName]) store.state.milestone.inventory[itemName] = 0;
  store.state.milestone.inventory[itemName]++;
  
  console.log("giveItem "+itemName)
}

function giveItemFunc(itemName) {
  return function() {
    giveItem(itemName);
  }
}

function revealItem(itemName,row,col,prop) {
  if (prop == 0) return;
  var x = Math.random();
  if (x<=prop) {
    console.log("Reveal "+row+" "+col+" "+itemName);
    store.state.items[row][col].push(store.state.items_info[itemName]);
  }
}

function itemCollide(row,col) {
  for(let item of store.state.items[row][col]) {
    giveItem(item.name);
  }
  Vue.set(store.state.items[row],col,[]);
}

export default function () {
  if (!window.store) {
    Vue.use(Vuex)

    window.store = new Vuex.Store({
      //Note: Top level of state is fixed, add property can lead to bug.
      //Current flexibility level require you to intialize all global state name before.
      //(but it can has value of null or undefined)
      state: {
        blocks: newArray(5, 50 , {
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
          onDigged: function() {
            giveItem("grass");
            revealItem("stone",this._row,this._col,0.75);
          },
          texture: 'url(https://c1.staticflickr.com/4/3516/3811405243_70511d8797_b.jpg)'
        },0 ,0)
        // soft stone
        .concat(newArray(5, 50 , {
          digged: false,
          hp: 5,
          maxHp: 5,
          armor: 1,
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
          onDigged: function() {
            giveItem("stone");
            revealItem("sharpstone",this._row,this._col,0.5);
          },
          texture: 'url(https://www.argentaceramica.com//thumbnailsenv.php?ruta=ficheros_sw/despiece/67283.jpg&env=425)'
        }, 5, 0)),
        items: newArray(10, 50, []),
        blockWidth: 50,
        blockHeight: 50,
        npcs: [
          {
            bound: {
              prog: {
                top: -100.1,
                left: 962,
                width: 100,
                height: 100
              },
              real: {
                top: -100.1,
                left: 962,
                width: 100,
                height: 100
              }
            },
            onCollide: function() {
              //console.log("NPC House collided")
            },
            onActivate: function() {
              if (!store.state.quests[5].inprogress()) {
                if (store.state.quests[5].showtonpc()) {
                  alert('Quest "'+store.state.quests[5].title+'" Accepted');
                  store.state.quests[5].accepted = true;
                }
              } else {
                if (!store.state.quests[5].isCompleted()) {
                  if (store.state.player.inventory.stone >= 20 && store.state.player.inventory.sharpstone >= 2) {
                    store.state.player.inventory.stone -= 30;
                    store.state.player.inventory.sharpstone -= 2;
                    store.state.quests[5].isGiven = true;
                    alert("Give 2 sharp stone and 30 stone to NPC");
                  } else {
                    alert("Hmm... Still not enough");
                  }
                }
              }
              
              if (!store.state.quests[4].inprogress()) {
                if (store.state.quests[4].showtonpc()) {
                  alert('Quest "'+store.state.quests[4].title+'" Accepted');
                  store.state.quests[4].accepted = true;
                }
              } else {
                if (!store.state.quests[4].isCompleted()) {
                  if (store.state.player.inventory.stone >= 20) {
                    store.state.player.inventory.stone -= 20;
                    store.state.quests[4].isGiven = true;
                    alert("Give 20 stone to NPC");
                  } else {
                    alert("Hmm... Still not enough");
                  }
                }
              }
              
              
              if (!store.state.quests[3].inprogress()) {
                if (store.state.quests[3].showtonpc()) {
                  alert('Quest "'+store.state.quests[3].title+'" Accepted');
                  store.state.quests[3].accepted = true;
                }
              } else {
                if (!store.state.quests[3].isCompleted()) {
                  if (store.state.player.inventory.stone >= 5) {
                    store.state.player.inventory.stone -= 5;
                    store.state.quests[3].isGiven = true;
                    alert("Give 5 stone to NPC");
                  } else {
                    alert("Hmm... Still not enough");
                  }
                }
              }
            },
            img: "https://u.cubeupload.com/Chomtana/home.png",
            show: true
          },
          {
            bound: {
              prog: {
                top: -100.1,
                left: 962,
                width: 100,
                height: 100
              },
              real: {
                top: -100.1,
                left: 962,
                width: 100,
                height: 100
              }
            },
            onCollide: function() {
              //console.log("NPC House collided")
            },
            onActivate: function() {
              if (!store.state.quests[3].inprogress()) {
                if (store.state.quests[3].showtonpc()) {
                  alert('Quest "'+store.state.quests[3].title+'" Accepted');
                  store.state.quests[3].accepted = true;
                }
              } else {
                if (store.state.player.inventory.stone >= 5) {
                  store.state.player.inventory.stone -= 5;
                  store.state.quests[3].isGiven = true;
                  alert("Give 5 stone to NPC");
                }
              }
            },
            img: "https://u.cubeupload.com/Chomtana/home.png",
            show: false
          }
        ],
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
        milestone: {
          inventory: {
            
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
            value: 1,
            name: "grass",
            title: "Grass"
          },
          stone: {
            weight: 5,
            value: 20,
            texture: 'url(http://pluspng.com/img-png/png-stone-stone-png-1024.png)',
            name: "stone",
            title: "Stone"
          },
          sharpstone: {
            weight: 20,
            value: 100,
            texture: 'url(https://vignette.wikia.nocookie.net/darksouls/images/4/48/Sharp_Gem.png/revision/latest?cb=20160614082155)',
            name: "sharpstone",
            title: "Sharp Stone"
          }
        },
        quests: [
          { // 0
            title: "Pick one grass",
            description: "You are new to this world, try picking one grass to make you get used to this world.",
            inprogress: function() {
              return true;
            },
            showtonpc: function() {
              return false;
            },
            isCompleted: function () {
              if (!this.milestone) return false;
              var milestone = store.state.milestone;
              var inventory = milestone.inventory;
              var start_milestone = this.milestone;
              var start_inventory = start_milestone.inventory;
              
              if (!start_inventory["grass"]) start_inventory["grass"] = 0;
              if (!inventory["grass"]) return false;
              
              return inventory["grass"] - start_inventory["grass"] >=1;
            }
          },
          { // 1
            title: "Pick two more grass",
            description: "You are still new to this world, try picking many grass to make you get used to this world.",
            inprogress: function() {
              return store.state.quests[0].isCompleted();
            },
            showtonpc: function() {
              return false;
            },
            isCompleted: function () {
              if (!this.milestone) return false;
              var milestone = store.state.milestone;
              var inventory = milestone.inventory;
              var start_milestone = this.milestone;
              var start_inventory = start_milestone.inventory;
              
              if (!start_inventory["grass"]) start_inventory["grass"] = 0;
              if (!inventory["grass"]) return false;
              
              return inventory["grass"] - start_inventory["grass"] >= 2;
            }
          },
          { // 2
            title: "Novice grass picker",
            description: "You now get used to this world, let pick some more grass",
            inprogress: function() {
              return store.state.quests[1].isCompleted();
            },
            showtonpc: function() {
              return false;
            },
            isCompleted: function () {
              if (!this.milestone) return false;
              var milestone = store.state.milestone;
              var inventory = milestone.inventory;
              var start_milestone = this.milestone;
              var start_inventory = start_milestone.inventory;
              
              if (!start_inventory["grass"]) start_inventory["grass"] = 0;
              if (!inventory["grass"]) return false;
              
              return inventory["grass"] - start_inventory["grass"] >= 20;
            }
          },
          { // 3
            title: "Can I pick grass more faster?",
            description: "Hmm, if you give me 5 stone I will make you able to pick grass more faster",
            isGiven: false,
            completed: false,
            accepted: false,
            inprogress: function() {
              return this.accepted;
            },
            showtonpc: function() {
              return store.state.quests[1].isCompleted();
            },
            isCompleted: function () {
              if (!this.completed && this.isGiven) {
                this.completed = true;
                this.onComplete();
              }
              return this.isGiven;
            },
            onComplete: function() {
              store.state.player.drill.damage += 0.1;
              alert("You can pick grass faster now!");
            }
          },
          { // 4
            title: "Can I pick soft stone?",
            description: "Hmm, if you give me some amount of stone I will make you able to pick soft stone",
            isGiven: false,
            completed: false,
            accepted: false,
            inprogress: function() {
              return this.accepted;
            },
            showtonpc: function() {
              return store.state.quests[3].isCompleted();
            },
            isCompleted: function () {
              if (!this.completed && this.isGiven) {
                this.completed = true;
                this.onComplete();
              }
              return this.isGiven;
            },
            onComplete: function() {
              store.state.player.drill.damage += 0.5;
              alert("You can pick soft stone now!");
            }
          },
          { // 5
            title: "Why picking soft stone very slow?",
            description: "Hmm, if you give me 2 sharp stone and 30 stone I will make you pick soft stone faster",
            isGiven: false,
            completed: false,
            accepted: false,
            inprogress: function() {
              return this.accepted;
            },
            showtonpc: function() {
              return store.state.quests[4].isCompleted();
            },
            isCompleted: function () {
              if (!this.completed && this.isGiven) {
                this.completed = true;
                this.onComplete();
              }
              return this.isGiven;
            },
            onComplete: function() {
              store.state.player.drill.damage += 0.5;
              alert("You can pick soft stone faster now!");
            }
          },
          { // 6
            title: "Why only picking soft stone?",
            description: "Hmm, if you give me 20 sharp stone and 100 stone I will make you able to pick hard stone",
            isGiven: false,
            completed: false,
            accepted: false,
            inprogress: function() {
              return this.accepted;
            },
            showtonpc: function() {
              return store.state.quests[5].isCompleted();
            },
            isCompleted: function () {
              if (!this.completed && this.isGiven) {
                this.completed = true;
                this.onComplete();
              }
              return this.isGiven;
            },
            onComplete: function() {
              store.state.player.drill.damage += 0.75;
              alert("You can pick hard stone now!");
            }
          },
        ]
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
      } else if (event.which==69) {
        for(var i = 0;i<store.state.npcs.length;i++) {
          var npc = store.state.npcs[i];
          var npcBound = jqueryBound_camRelative($('#npc-'+i))
          //console.log(npcBound);
          //console.log(checkCollidePercent(store.state.player.bound.prog,npcBound));
          if (npcBound) {
            if (checkCollidePercent(store.state.player.bound.prog,npcBound) > 0.9) {              
              npc.onActivate();
            }
          }
        }
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

    function jqueryBound_camRelative(ele) {
      if (!ele.length || (ele.length && ele.length==0)) return null;
      var res = ele.position();
      res.top += store.state.camera.top - store.state.playableHeight/2;
      res.left += store.state.camera.left - store.state.playableWidth/2;
      res.width = ele.width();
      res.height = ele.height();
      return res;
    }
    
    function calBoundArea(bound) {
      return bound.width * bound.height;
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
    
    function checkCollidePerfectIn(boundA,boundB) {
      //console.log(boundB.left,boundA.left + boundA.width)
      return (
        (boundA.left+boundA.width <= boundB.left+boundB.width) &&
        (boundA.left >= boundB.left) &&
        (boundA.top >= boundB.top) &&
        (boundA.top+boundA.height <= boundB.top+boundB.height)
      ) || (
        (boundB.left+boundB.width <= boundA.left+boundA.width) &&
        (boundB.left >= boundA.left) &&
        (boundB.top >= boundA.top) &&
        (boundB.top+boundB.height <= boundA.top+boundA.height)
      )
    }
    
    function calCollideArea(boundA,boundB) {
      var left = Math.max(boundA.left,boundB.left);
      var right = Math.min(boundA.left + boundA.width, boundB.left + boundB.width);
      var top = Math.max(boundA.top,boundB.top);
      var bottom = Math.min(boundA.top + boundA.height,boundB.top + boundB.height);
      
      if (left<right && top<bottom) {
        return (right-left)*(bottom-top);
      }
      
      return 0;
    }
    
    function checkCollidePercent(boundA,boundB) {
      var small = (calBoundArea(boundA) < calBoundArea(boundB) ? boundA : boundB);
      var area = calCollideArea(boundA,boundB);
      
      return area/calBoundArea(small);
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
          
          var itemBlockBound = jqueryBound($('#item-block-'+(playerBlock[0]+i)+'-'+(playerBlock[1]+j)))
          
          if (itemBlockBound && store.state.items[playerBlock[0]+i][playerBlock[1]+j].length > 0) {
            //console.log(checkCollidePercent(store.state.player.bound.prog,itemBlockBound))
            if (checkCollidePercent(store.state.player.bound.prog,itemBlockBound) > 0.5) {              
              itemCollide(playerBlock[0]+i,playerBlock[1]+j)
            }
          }
        }
      }
      
      for(var i = 0;i<store.state.npcs.length;i++) {
        var npc = store.state.npcs[i];
        var npcBound = jqueryBound_camRelative($('#npc-'+i))
        //console.log(npcBound);
        //console.log(checkCollidePercent(store.state.player.bound.prog,npcBound));
        if (npcBound) {
          if (checkCollidePercent(store.state.player.bound.prog,npcBound) > 0.9) {              
            npc.onCollide();
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