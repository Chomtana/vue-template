import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'

export default function () {
  if (!window.store) {
    Vue.use(Vuex)

    window.store = new Vuex.Store({
      //Note: Top level of state is fixed, add property can lead to bug.
      //Current flexibility level require you to intialize all global state name before.
      //(but it can has value of null or undefined)
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      }
    })

    //console.log(Vue.store.state);

    Vue.mixin({
      computed: (function(){
        var res = {};
        for(var x in window.store.state) {
          res[x] = {
            get: ()=>window.store.state[x],
            set: (val)=>window.store.state[x] = val
          }
        }
        
        for(var x in window.store.getters) {
          res[x] = ()=>window.store.getters[x]
        }
        
        return res;
      })(),
      methods: (function() {
        var keys = [];
        for(var x in window.store._mutations) {
          keys.push(x)
        }
        return mapMutations(keys);
      })()
    });
  }
}