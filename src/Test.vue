<template>
    <div>
        {{count}}
        <button @click="increment">increase</button>
    </div>
</template>

<script>
    initGlobal()
    
    store.commit("increment")

    export default {
        store,
        data () {
            return {
                msg: 'Welcome to Your Vue.js App dasdasdasdasd'
            }
        }
    }
</script>